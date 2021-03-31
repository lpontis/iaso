from django.core.management.base import BaseCommand
import csv
from iaso.models import OrgUnit, OrgUnitType, DataSource, SourceVersion, Project
from django.contrib.gis.geos import Point
from uuid import uuid4
from django.db import models, transaction


def get_or_create(unit_dict, name, org_unit_type, parent_id, version_id, longitude, latitude, source_ref, save=True):
    id_string = "%s%s" % (name, parent_id)
    org_unit = unit_dict.get(id_string, None)
    if save and org_unit is None:
        org_units = OrgUnit.objects.filter(name=name, parent_id=parent_id, version_id=version_id, org_unit_type=org_unit_type)
        #if org_units.count() > 1:
        #    print("POTENTIAL PROBLEM WITH DUPLICATE NAMES %s parent_id %s" % (name, parent_id))
        if org_units.count() > 0:
            org_unit = org_units.first()

    if org_unit is None:

        org_unit = OrgUnit()
        org_unit.org_unit_type = org_unit_type
        org_unit.name = name.strip()
        org_unit.version_id = version_id
        org_unit.source_ref = source_ref
        org_unit.validation_status = "VALID"

        org_unit.parent_id = parent_id

        if longitude and latitude:
            longitude = float(longitude)
            latitude = float(latitude)
            org_unit.location = Point(x=longitude, y=latitude, z=0, srid=4326)

        if save:
            org_unit.save(skip_calculate_path=True)
        #print("save")

    unit_dict[id_string] = org_unit
    return org_unit

column_dict = {
    "name": "Nom Ecole",
    "parents": ["Proved", "Sproved", "Territoire", "Groupement", "Commune"],
    "longitude": "GPS_longitude",
    "latitude": "GPS_latitude",
    "source_ref": "Numero SECOPE",
}


def get_or_create_org_unit_type(name, project):
    out = OrgUnitType.objects.filter(projects=project, name=name).first()
    if not out:
        out, created = OrgUnitType.objects.get_or_create(name=name, short_name=name[:4])
        out.projects.add(project)
    return out


class Command(BaseCommand):
    help = "Import a complete tree from a csv file"

    def add_arguments(self, parser):
        parser.add_argument(
            "--org_unit_csv_file", type=str
        )
        parser.add_argument(
            "--source_name", type=str
        )
        parser.add_argument(
            "--version_number", type=int
        )
        parser.add_argument(
            "--project_id", type=int
        )
        parser.add_argument(
            "--main_org_unit_name", type=str
        )

        parser.add_argument(
            "--validation_status", type=str
        )
        #parser.add_argument("project", type=str)



    def handle(self, *args, **options):
        with transaction.atomic():
            file_name = options.get("org_unit_csv_file")
            source_name = options.get("source_name")
            version = options.get("version_number")
            project_id = options.get("project_id")
            main_org_unit_name = options.get("main_org_unit_name")

            source, created = DataSource.objects.get_or_create(name=source_name)
            source.projects.add(project_id)
            version, created = SourceVersion.objects.get_or_create(number=version, data_source=source)

            org_unit_dicts = {}
            previous_outs = []
            project = Project.objects.get(id=project_id)
            main_out = get_or_create_org_unit_type(name=main_org_unit_name, project=project)
            print("Creating Org Unit Types")
            for parent in column_dict["parents"]:
                out = get_or_create_org_unit_type(name=parent, project=project)

                out.projects.add(project)

                if previous_outs:
                    for p in previous_outs:
                        p.sub_unit_types.add(out)
                        p.sub_unit_types.add(main_out)

                previous_outs.append(out)
                d = {"type": out, "units": {}}

                org_unit_dicts[parent] = d


            main_out.projects.add(project)
            leaf_units = []
            parent_units = []
            top_org_units = set([])
            print("Inserting all units")
            index = 0
            with open(file_name) as csvfile:
                csv_reader = csv.reader(csvfile, delimiter=";")
                index = 1
                for row in csv_reader:
                    if index % 1000 == 0:
                        print("index", index)

                    if index == 1:

                        headers = row
                        col_indices = {headers[i]: i for i in range(len(headers))}
                    else:
                        try:
                            previous_parent = None
                            for parent in column_dict["parents"]:
                                type = org_unit_dicts[parent]["type"]
                                name = row[col_indices[parent]]
                                top = False
                                if not previous_parent:
                                    top = True
                                previous_parent = get_or_create(org_unit_dicts[parent]["units"], name, type, previous_parent.id if previous_parent else None, version.id, None, None, None)
                                parent_units.append(previous_parent)
                                if top:
                                    top_org_units.add(previous_parent)
                            name = row[col_indices[column_dict["name"]]]
                            source_ref = row[col_indices[column_dict["source_ref"]]]
                            latitude = row[col_indices[column_dict["latitude"]]]
                            longitude = row[col_indices[column_dict["longitude"]]]
                            #print("previous_parent", previous_parent)
                            unit = get_or_create({}, name, main_out, previous_parent.id, version.id, longitude, latitude, source_ref, save=False)
                            leaf_units.append(unit)
                            index += 1
                        except Exception as e:
                            print("Error %s for row %d" % (e, index), row)
                            break
                    index = index + 1

            print("bulk_creating leafs")
            OrgUnit.objects.bulk_create(leaf_units)

            print("computing paths for parents")
            top_parents = OrgUnit.objects.filter(id__in=[u.id for u in parent_units]).exclude(parent__path=None).filter(path=None)
            for ou in top_parents:
                print("computing for", ou)
                ou.save(force_recalculate=True)

            #print("bulk updating parents")
            #OrgUnit.objects.bulk_update(top_parents, ['path'])

            print("computing paths for children")
            ou_with_parents = OrgUnit.objects.filter(id__in=[u.id for u in leaf_units]).select_related("parent")
            index = 0
            for ou in ou_with_parents:
                if index % 1000 == 0:
                    print("index", index)
                ou.calculate_paths()
                index += 1
            print("bulk updating children")
            OrgUnit.objects.bulk_update(ou_with_parents, ['path'])

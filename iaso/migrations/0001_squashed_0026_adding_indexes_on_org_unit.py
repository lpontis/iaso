# Generated by Django 2.2.4 on 2019-09-30 13:36

from django.conf import settings
import django.contrib.gis.db.models.fields
import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion
from django.contrib.postgres.operations import CreateExtension, TrigramExtension
from django.db import migrations
from django.contrib.postgres.operations import CITextExtension


class Migration(migrations.Migration):

    replaces = [
        ("iaso", "0001_initial"),
        ("iaso", "0002_auto_20190617_1232"),
        ("iaso", "0003_auto_20190617_1347"),
        ("iaso", "0004_form"),
        ("iaso", "0005_auto_20190619_1334"),
        ("iaso", "0006_auto_20190624_0938"),
        ("iaso", "0007_auto_20190624_1155"),
        ("iaso", "0008_auto_20190627_2052"),
        ("iaso", "0009_auto_20190628_0933"),
        ("iaso", "0010_orgunit_uuid"),
        ("iaso", "0011_orgunit_custom"),
        ("iaso", "0012_orgunit_validated"),
        ("iaso", "0013_auto_20190628_1342"),
        ("iaso", "0014_account_device_deviceownership_project"),
        ("iaso", "0015_instance_uuid"),
        ("iaso", "0016_instance_name"),
        ("iaso", "0017_auto_20190809_1205"),
        ("iaso", "0018_instance_json"),
        ("iaso", "0019_instancefile_device"),
        ("iaso", "0020_auto_20190814_2327"),
        ("iaso", "0021_auto_20190815_2254"),
        ("iaso", "0022_link_matchingalgorithm"),
        ("iaso", "0023_datasource_version"),
        ("iaso", "0024_altering_fields_on_sources"),
        ("iaso", "0025_creating_trypelim_source"),
        ("iaso", "0026_adding_indexes_on_org_unit"),
    ]

    initial = True

    dependencies = [migrations.swappable_dependency(settings.AUTH_USER_MODEL)]

    operations = [
        CreateExtension("postgis"),
        TrigramExtension(),
        CITextExtension(),
        migrations.CreateModel(
            name="OrgUnitType",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("name", models.CharField(max_length=255)),
                ("short_name", models.CharField(max_length=255)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "sub_unit_types",
                    models.ManyToManyField(
                        blank=True, related_name="super_types", to="iaso.OrgUnitType"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="FormVersion",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("file", models.FileField(blank=True, null=True, upload_to="forms/")),
                ("version_id", models.TextField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name="Form",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("form_id", models.TextField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.TextField(blank=True, null=True)),
                ("org_unit_types", models.ManyToManyField(blank=True, to="iaso.OrgUnitType")),
            ],
        ),
        migrations.CreateModel(
            name="OrgUnit",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("name", models.CharField(max_length=255)),
                (
                    "aliases",
                    django.contrib.postgres.fields.ArrayField(
                        base_field=django.contrib.postgres.fields.citext.CITextField(
                            blank=True, max_length=255
                        ),
                        blank=True,
                        null=True,
                        size=100,
                    ),
                ),
                (
                    "source",
                    models.TextField(
                        blank=True,
                        choices=[
                            ("snis", "SNIS"),
                            ("ucla", "UCLA"),
                            ("pnltha", "PNL THA"),
                            ("kemri", "KEMRI"),
                            ("derivated", "Derivated from actual data"),
                        ],
                        null=True,
                    ),
                ),
                ("source_ref", models.TextField(blank=True, null=True)),
                (
                    "geom",
                    django.contrib.gis.db.models.fields.PolygonField(
                        blank=True, null=True, srid=4326
                    ),
                ),
                (
                    "simplified_geom",
                    django.contrib.gis.db.models.fields.PolygonField(
                        blank=True, null=True, srid=4326
                    ),
                ),
                (
                    "geom_source",
                    models.TextField(
                        blank=True,
                        choices=[
                            ("snis", "SNIS"),
                            ("ucla", "UCLA"),
                            ("pnltha", "PNL THA"),
                            ("kemri", "KEMRI"),
                            ("derivated", "Derivated from actual data"),
                        ],
                        null=True,
                    ),
                ),
                ("geom_ref", models.IntegerField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "org_unit_type",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="iaso.OrgUnitType",
                    ),
                ),
                (
                    "parent",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="iaso.OrgUnit",
                    ),
                ),
                ("gps_source", models.TextField(blank=True, null=True)),
                (
                    "latitude",
                    models.DecimalField(blank=True, decimal_places=8, max_digits=10, null=True),
                ),
                ("location", django.contrib.gis.db.models.fields.PointField(null=True, srid=4326)),
                (
                    "longitude",
                    models.DecimalField(blank=True, decimal_places=8, max_digits=11, null=True),
                ),
                ("uuid", models.TextField(blank=True, null=True)),
                ("custom", models.BooleanField(default=False)),
                ("validated", models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name="Account",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("name", models.TextField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("users", models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name="Device",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("imei", models.CharField(blank=True, max_length=20, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("test_device", models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name="DeviceOwnerShip",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("start", models.DateTimeField(auto_now_add=True)),
                ("end", models.DateTimeField(auto_now_add=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "device",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="iaso.Device"
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Project",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("name", models.TextField(blank=True, null=True)),
                ("app_id", models.TextField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "account",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to="iaso.Account",
                    ),
                ),
                ("forms", models.ManyToManyField(blank=True, to="iaso.Form")),
            ],
        ),
        migrations.AddField(
            model_name="form",
            name="projects",
            field=models.ManyToManyField(blank=True, to="iaso.Project"),
        ),
        migrations.AddField(
            model_name="orgunittype",
            name="projects",
            field=models.ManyToManyField(blank=True, related_name="unit_types", to="iaso.Project"),
        ),
        migrations.CreateModel(
            name="Instance",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                (
                    "form",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to="iaso.Form",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("file", models.FileField(blank=True, null=True, upload_to="instances/")),
                ("file_name", models.TextField(blank=True, null=True)),
                ("location", django.contrib.gis.db.models.fields.PointField(null=True, srid=4326)),
                (
                    "org_unit",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to="iaso.OrgUnit",
                    ),
                ),
                ("uuid", models.TextField(blank=True, null=True)),
                ("name", models.TextField(blank=True, null=True)),
                ("json", django.contrib.postgres.fields.jsonb.JSONField(blank=True, null=True)),
                ("accuracy", models.DecimalField(decimal_places=2, max_digits=7, null=True)),
                (
                    "device",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to="iaso.Device",
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="form", name="device_field", field=models.TextField(blank=True, null=True)
        ),
        migrations.AddField(
            model_name="form", name="location_field", field=models.TextField(blank=True, null=True)
        ),
        migrations.CreateModel(
            name="InstanceFile",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.TextField(blank=True, null=True)),
                ("file", models.FileField(blank=True, null=True, upload_to="instancefiles/")),
                (
                    "instance",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to="iaso.Instance",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="MatchingAlgorithm",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("name", models.TextField()),
                ("description", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name="Link",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("validated", models.BooleanField(default=False)),
                ("validation_date", models.DateTimeField(auto_now=True, null=True)),
                ("similarity_score", models.SmallIntegerField(null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "algorithm",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="iaso.MatchingAlgorithm"
                    ),
                ),
                (
                    "destination",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="source_set",
                        to="iaso.OrgUnit",
                    ),
                ),
                (
                    "source",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="destination_set",
                        to="iaso.OrgUnit",
                    ),
                ),
                (
                    "validator",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="DataSource",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("name", models.CharField(max_length=255)),
                ("description", models.TextField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name="SourceVersion",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("number", models.IntegerField()),
                ("description", models.TextField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "data_source",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="iaso.DataSource"
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="orgunit",
            name="version",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="iaso.SourceVersion",
            ),
        ),
        migrations.AlterField(
            model_name="orgunit",
            name="geom_source",
            field=models.TextField(
                blank=True,
                choices=[
                    ("snis", "SNIS"),
                    ("ucla", "UCLA"),
                    ("pnltha", "PNL THA"),
                    ("derivated", "Derivated from actual data"),
                ],
                null=True,
            ),
        ),
        migrations.AlterField(
            model_name="orgunit",
            name="source",
            field=models.TextField(
                blank=True,
                choices=[
                    ("snis", "SNIS"),
                    ("ucla", "UCLA"),
                    ("pnltha", "PNL THA"),
                    ("derivated", "Derivated from actual data"),
                ],
                null=True,
            ),
        ),
        migrations.AlterField(
            model_name="orgunit",
            name="source_ref",
            field=models.TextField(blank=True, db_index=True, null=True),
        ),
        migrations.AlterField(
            model_name="orgunit",
            name="uuid",
            field=models.TextField(blank=True, db_index=True, null=True),
        ),
        migrations.AlterField(
            model_name="orgunit",
            name="validated",
            field=models.BooleanField(db_index=True, default=True),
        ),
    ]

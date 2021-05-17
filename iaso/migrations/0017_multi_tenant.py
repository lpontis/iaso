# Generated by Django 2.1.11 on 2019-11-27 14:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [("iaso", "0016_groupset")]

    operations = [
        migrations.RemoveField(model_name="form", name="projects"),
        migrations.AddField(
            model_name="datasource",
            name="projects",
            field=models.ManyToManyField(
                blank=True, related_name="data_sources", to="iaso.Project"
            ),
        ),
        migrations.AddField(
            model_name="deviceownership",
            name="project",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.DO_NOTHING,
                to="iaso.Project",
            ),
        ),
        migrations.AddField(
            model_name="group",
            name="projects",
            field=models.ManyToManyField(blank=True, related_name="groups", to="iaso.Project"),
        ),
        migrations.AddField(
            model_name="groupset",
            name="projects",
            field=models.ManyToManyField(blank=True, related_name="group_sets", to="iaso.Project"),
        ),
        migrations.AddField(
            model_name="instance",
            name="project",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.DO_NOTHING,
                to="iaso.Project",
            ),
        ),
        migrations.AddField(
            model_name="record",
            name="record_type",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="iaso.RecordType",
            ),
        ),
        migrations.AddField(
            model_name="recordtype",
            name="projects",
            field=models.ManyToManyField(
                blank=True, related_name="record_types", to="iaso.Project"
            ),
        ),
    ]

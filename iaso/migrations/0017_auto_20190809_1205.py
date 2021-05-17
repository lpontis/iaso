# Generated by Django 2.2.4 on 2019-08-09 12:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [("iaso", "0016_instance_name")]

    operations = [
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
    ]

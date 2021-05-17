# Generated by Django 2.1.11 on 2020-01-21 13:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [("iaso", "0030_merge_20200102_0916")]

    operations = [
        migrations.AddField(
            model_name="form",
            name="period_type",
            field=models.TextField(
                blank=True,
                choices=[
                    ("YEAR", "Year"),
                    ("QUARTER", "Quarter"),
                    ("MONTH", "Month"),
                    ("SIX_MONTH", "Six-month"),
                ],
                null=True,
            ),
        ),
        migrations.AddField(
            model_name="form", name="single_per_period", field=models.NullBooleanField()
        ),
        migrations.AddField(
            model_name="instance",
            name="period",
            field=models.TextField(blank=True, db_index=True, null=True),
        ),
        migrations.AlterField(
            model_name="groupset",
            name="groups",
            field=models.ManyToManyField(blank=True, related_name="group_sets", to="iaso.Group"),
        ),
    ]

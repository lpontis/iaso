# Generated by Django 3.0.3 on 2020-12-09 14:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [("iaso", "0068_auto_20201209_1359")]

    operations = [
        migrations.AddField(
            model_name="deviceposition",
            name="transport",
            field=models.CharField(
                choices=[("car", "Car"), ("foot", "Foot"), ("truck", "Truc")],
                default="car",
                max_length=32,
            ),
            preserve_default=False,
        )
    ]

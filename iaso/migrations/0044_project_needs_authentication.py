# Generated by Django 2.1.11 on 2020-05-02 07:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [("iaso", "0043_auto_20200428_0650")]

    operations = [
        migrations.AddField(
            model_name="project",
            name="needs_authentication",
            field=models.BooleanField(default=False),
        )
    ]

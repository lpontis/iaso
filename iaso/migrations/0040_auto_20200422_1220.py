# Generated by Django 2.1.11 on 2020-04-22 12:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [("iaso", "0039_formversion_form_descriptor")]

    operations = [
        migrations.AddField(
            model_name="form", name="correlatable", field=models.BooleanField(default=False)
        ),
        migrations.AddField(
            model_name="form",
            name="correlation_field",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="instance",
            name="correlation_id",
            field=models.IntegerField(blank=True, null=True),
        ),
    ]

# Generated by Django 3.0.7 on 2021-04-30 16:15

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('iaso', '0085_merge_20210415_2144'),
    ]

    operations = [
        migrations.CreateModel(
            name='Round',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('started_at', models.DateTimeField(blank=True, null=True)),
                ('ended_at', models.DateTimeField(blank=True, null=True)),
                ('mop_up_started_at', models.DateTimeField(blank=True, null=True)),
                ('mop_up_ended_at', models.DateTimeField(blank=True, null=True)),
                ('im_started_at', models.DateTimeField(blank=True, null=True)),
                ('im_ended_at', models.DateTimeField(blank=True, null=True)),
                ('lqas_started_at', models.DateTimeField(blank=True, null=True)),
                ('lqas_ended_at', models.DateTimeField(blank=True, null=True)),
                ('target_population', models.IntegerField(blank=True, null=True)),
                ('cost', models.DecimalField(blank=True, decimal_places=2, default=0.0, max_digits=10, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Campaign',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('epid', models.CharField(blank=True, default='', max_length=255, null=True)),
                ('obr_name', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True, null=True)),
                ('onset_at', models.DateTimeField(blank=True, help_text='When the campaign starts', null=True)),
                ('three_level_call_at', models.DateTimeField(blank=True, null=True, verbose_name='3 level call')),
                ('cvdpv_notified_at', models.DateTimeField(blank=True, null=True, verbose_name='cVDPV Notication')),
                ('cvdpv2_notified_at', models.DateTimeField(blank=True, null=True, verbose_name='cVDPV2 Notication')),
                ('pv_notified_at', models.DateTimeField(blank=True, null=True, verbose_name='PV Notication')),
                ('pv2_notified_at', models.DateTimeField(blank=True, null=True, verbose_name='PV2 Notication')),
                ('virus', models.CharField(blank=True, choices=[('PV1', 'PV1'), ('PV2', 'PV2'), ('PV3', 'PV3'), ('cVDPV2', 'cVDPV2')], max_length=6, null=True)),
                ('vacine', models.CharField(blank=True, choices=[('mOPV2', 'mOPV2'), ('nOPV2', 'nOPV2'), ('bOPV', 'bOPV')], max_length=5, null=True)),
                ('detection_status', models.CharField(blank=True, choices=[('PENDING', 'Pending'), ('ONGOING', 'Ongoing'), ('FINISHED', 'Finished')], max_length=10, null=True)),
                ('detection_responsible', models.CharField(blank=True, choices=[('WHO', 'WHO'), ('UNICEF', 'UNICEF'), ('NAT', 'National'), ('MOH', 'MOH'), ('PROV', 'PROVINCE'), ('DIST', 'District')], max_length=10, null=True)),
                ('detection_first_draft_submitted_at', models.DateTimeField(blank=True, null=True, verbose_name='1st Draft Submission')),
                ('detection_rrt_oprtt_approval_at', models.DateTimeField(blank=True, null=True, verbose_name='RRT/OPRTT Approval')),
                ('risk_assessment_status', models.CharField(blank=True, choices=[('PENDING', 'Pending'), ('ONGOING', 'Ongoing'), ('FINISHED', 'Finished')], max_length=10, null=True)),
                ('risk_assessment_responsible', models.CharField(blank=True, choices=[('WHO', 'WHO'), ('UNICEF', 'UNICEF'), ('NAT', 'National'), ('MOH', 'MOH'), ('PROV', 'PROVINCE'), ('DIST', 'District')], max_length=10, null=True)),
                ('investigation_at', models.DateTimeField(blank=True, null=True, verbose_name='Field Investigation Date')),
                ('risk_assessment_first_draft_submitted_at', models.DateTimeField(blank=True, null=True, verbose_name='1st Draft Submission')),
                ('risk_assessment_rrt_oprtt_approval_at', models.DateTimeField(blank=True, null=True, verbose_name='RRT/OPRTT Approval')),
                ('ag_nopv_group_met_at', models.DateTimeField(blank=True, null=True, verbose_name='AG/nOPV Group')),
                ('dg_authorized_at', models.DateTimeField(blank=True, null=True, verbose_name='DG Authorization')),
                ('budget_status', models.CharField(blank=True, choices=[('PENDING', 'Pending'), ('ONGOING', 'Ongoing'), ('FINISHED', 'Finished')], max_length=10, null=True)),
                ('budget_responsible', models.CharField(blank=True, choices=[('WHO', 'WHO'), ('UNICEF', 'UNICEF'), ('NAT', 'National'), ('MOH', 'MOH'), ('PROV', 'PROVINCE'), ('DIST', 'District')], max_length=10, null=True)),
                ('eomg', models.DateTimeField(blank=True, null=True, verbose_name='EOMG')),
                ('no_regret_fund_amount', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('initial_org_unit', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='campaigns', to='iaso.OrgUnit')),
                ('round_one', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='round_one', to='polio.Round')),
                ('round_two', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='round_two', to='polio.Round')),
            ],
        ),
    ]

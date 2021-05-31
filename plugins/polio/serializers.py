from rest_framework import serializers

from iaso.models import Group, OrgUnit
from .models import Round, Campaign


class GroupSerializer(serializers.ModelSerializer):
    org_units = serializers.PrimaryKeyRelatedField(many=True, allow_empty=True, queryset=OrgUnit.objects.all())

    class Meta:
        model = Group
        fields = ["name", "org_units"]


class RoundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Round
        fields = "__all__"


class CampaignSerializer(serializers.ModelSerializer):
    round_one = RoundSerializer()
    round_two = RoundSerializer()
    group = GroupSerializer(required=False)

    def create(self, validated_data):
        round_one_data = validated_data.pop("round_one")
        round_two_data = validated_data.pop("round_two")
        group = validated_data.pop("group") if "group" in validated_data else None

        if group:
            org_units = group.pop("org_units") if "org_units" in group else []
            campaign_group = Group.objects.create(**group)
            campaign_group.org_units.set(OrgUnit.objects.filter(pk__in=map(lambda org_unit: org_unit.id, org_units)))
        else:
            campaign_group = None

        return Campaign.objects.create(
            **validated_data,
            round_one=Round.objects.create(**round_one_data),
            round_two=Round.objects.create(**round_two_data),
            group=campaign_group,
        )

    def update(self, instance, validated_data):
        round_one_data = validated_data.pop("round_one")
        round_two_data = validated_data.pop("round_two")
        group = validated_data.pop("group")

        Round.objects.filter(pk=instance.round_one_id).update(**round_one_data)
        Round.objects.filter(pk=instance.round_two_id).update(**round_two_data)

        if group:
            org_units = group.pop("org_units") if "org_units" in group else []
            campaign_group = Group.objects.get(pk=instance.group_id)
            campaign_group.org_units.set(OrgUnit.objects.filter(pk__in=map(lambda org_unit: org_unit.id, org_units)))

        return super().update(instance, validated_data)

    class Meta:
        model = Campaign
        fields = "__all__"

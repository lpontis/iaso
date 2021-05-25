from rest_framework import serializers

from iaso.models import SingleEntityGroup
from .models import Round, Campaign

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = SingleEntityGroup
        fields = "__all__"

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

        return Campaign.objects.create(
            **validated_data,
            round_one=Round.objects.create(**round_one_data),
            round_two=Round.objects.create(**round_two_data),
            group = SingleEntityGroup.objects.create(**group) if group else None,
        )

    def update(self, instance, validated_data):
        round_one_data = validated_data.pop("round_one")
        round_two_data = validated_data.pop("round_two")
        group = validated_data.pop("group")

        Round.objects.filter(pk=instance.round_one_id).update(**round_one_data)
        Round.objects.filter(pk=instance.round_two_id).update(**round_two_data)
        SingleEntityGroup.objects.filter(pk=instance.group_id).update(**group)

        return super().update(instance, validated_data)

    class Meta:
        model = Campaign
        fields = "__all__"

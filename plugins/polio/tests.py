from rest_framework import status
from iaso.test import APITestCase
from iaso import models as m
from django.utils.timezone import now
from plugins.polio.models import Campaign

class CampaignTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.now = now()

        cls.data_source = m.DataSource.objects.create(name="Default source")
        cls.source_version_1 = m.SourceVersion.objects.create(data_source=cls.data_source, number=1)
        cls.source_version_2 = m.SourceVersion.objects.create(data_source=cls.data_source, number=2)

        star_wars = m.Account.objects.create(name="Star Wars", default_version=cls.source_version_2)

        cls.yoda = cls.create_user_with_profile(username="yoda", account=star_wars, permissions=["iaso_org_units"])

        cls.org_units = []
        cls.org_units.append(
            m.OrgUnit.objects.create(
                org_unit_type=m.OrgUnitType.objects.create(name="Jedi Council", short_name="Cnc"),
                version=cls.source_version_1,
                name="Jedi Council A",
                validation_status=m.OrgUnit.VALIDATION_VALID,
                source_ref="PvtAI4RUMkr",
            )
        )
        cls.org_units.append(
            m.OrgUnit.objects.create(
                org_unit_type=m.OrgUnitType.objects.create(name="Jedi Council", short_name="Cnc"),
                version=cls.source_version_1,
                name="Jedi Council A",
                validation_status=m.OrgUnit.VALIDATION_VALID,
                source_ref="PvtAI4RUMkr",
            )
        )

    def test_create_campaign(self):
        """
        Ensure we can create a new campaign object.
        """

        self.client.force_authenticate(self.yoda)

        response = self.client.post(f"/api/polio/campaigns/", data={
            "round_one": {},
            "round_two": {},
            "obr_name": "campaign name"
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Campaign.objects.count(), 1)
        self.assertEqual(Campaign.objects.get().obr_name, 'campaign name')

    def test_can_create_and_update_campaign_with_orgunits_group(self):
        """
        Ensure we can create a new campaign object with org units group
        """

        self.client.force_authenticate(self.yoda)

        response = self.client.post(
            f"/api/polio/campaigns/",
            data={
                "round_one": {},
                "round_two": {},
                "obr_name": "campaign with org units",
                "group": {
                    "name": "hidden group",
                    "org_units": [self.org_units[0].id]
                }
            },
            format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Campaign.objects.count(), 1)
        self.assertEqual(Campaign.objects.get().obr_name, 'campaign with org units')
        self.assertEqual(Campaign.objects.get().group.name, 'hidden group')
        self.assertEqual(Campaign.objects.get().group.org_units.count(), 1)

        response = self.client.put(
            f"/api/polio/campaigns/" + str(Campaign.objects.get().id) + "/",
            data={
                "round_one": {},
                "round_two": {},
                "obr_name": "campaign with org units",
                "group": {
                    "name": "hidden group",
                    "org_units": map(lambda org_unit: org_unit.id, self.org_units)
                }
            },
            format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Campaign.objects.get().group.org_units.count(), 2)



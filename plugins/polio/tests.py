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

    def test_create_campaign(self):
        """
        Ensure we can create a new campaign object.
        """

        self.client.force_authenticate(self.yoda)

        response = self.client.post(f"/api/polio/campaigns/", data={
            "round_one": {},
            "round_two": {},
            "group": {
                "name": "hidden group"
            },
            "obr_name": "campaign name"
        }, format='json')

        print(response.json())

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Campaign.objects.count(), 1)
        self.assertEqual(Campaign.objects.get().obr_name, 'campaign name')

    def test_create_campaign_with_orgunits_group(self):
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
                    "name": "hidden group"
                }
            },
            format='json'
        )

        print(response.json())

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Campaign.objects.count(), 1)
        self.assertEqual(Campaign.objects.get().obr_name, 'campaign with org units')


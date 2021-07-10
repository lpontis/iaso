from iaso.models.org_unit import OrgUnitType
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from plugins.polio.serializers import SurgePreviewSerializer
from iaso.models import OrgUnit
from plugins.polio.serializers import CampaignSerializer, PreparednessPreviewSerializer
from django.shortcuts import get_object_or_404
from rest_framework import routers, filters, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Campaign, Config
from iaso.api.common import ModelViewSet
import requests
import csv
from django.http import HttpResponse
from django.http import JsonResponse
import json
import datetime
from collections import defaultdict


class CustomFilterBackend(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        search = request.query_params.get("search")
        if search:
            country_types = OrgUnitType.objects.countries().only("id")
            org_units = OrgUnit.objects.filter(
                name__icontains=search, org_unit_type__in=country_types, path__isnull=False
            ).only("id")

            query = Q(obr_name__icontains=search) | Q(epid__icontains=search)
            if len(org_units) > 0:
                query.add(
                    Q(initial_org_unit__path__descendants=OrgUnit.objects.query_for_related_org_units(org_units)), Q.OR
                )

            return queryset.filter(query)

        return queryset


class CampaignViewSet(ModelViewSet):
    serializer_class = CampaignSerializer
    results_key = "campaigns"
    remove_results_key_if_paginated = True
    filters.OrderingFilter.ordering_param = "order"
    filter_backends = [filters.OrderingFilter, DjangoFilterBackend, CustomFilterBackend]
    ordering_fields = [
        "obr_name",
        "cvdpv2_notified_at",
        "detection_status",
        "round_one__started_at",
        "round_two__started_at",
    ]

    def get_queryset(self):
        user = self.request.user

        if user.iaso_profile.org_units.count():
            org_units = OrgUnit.objects.hierarchy(user.iaso_profile.org_units.all())

            return Campaign.objects.filter(initial_org_unit__in=org_units)
        else:
            return Campaign.objects.all()

    @action(methods=["POST"], detail=False, serializer_class=PreparednessPreviewSerializer)
    def preview_preparedness(self, request, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)

    @action(methods=["POST"], detail=False, serializer_class=SurgePreviewSerializer)
    def preview_surge(self, request, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)


class IMViewSet(viewsets.ViewSet):
    """
           Endpoint used to transform IM (independent monitoring) data from existing ODK forms stored in ONA. Very custom to the polio project.

    sample Config:

    configs = [
           {
               "keys": {"roundNumber": "roundNumber",
                       "Response": "Response",
                },
               "prefix": "OHH",
               "url": 'https://brol.com/api/v1/data/5888',
               "login": "qmsdkljf",
               "password": "qmsdlfj"
           },
           {
               "keys": {'roundNumber': "roundNumber",
                       "Response": "Response",
                },
               "prefix": "HH",
               "url":  'https://brol.com/api/v1/data/5887',
               "login": "qmsldkjf",
               "password": "qsdfmlkj"
           }
       ]
    """

    def list(self, request):

        slug = request.GET.get("country", None)
        as_csv = request.GET.get("format", None) == "csv"
        config = get_object_or_404(Config, slug=slug)
        res = []
        failure_count = 0
        all_keys = set()
        for config in config.content:
            keys = config["keys"]
            all_keys = all_keys.union(keys.keys())
            prefix = config["prefix"]
            response = requests.get(config["url"], auth=(config["login"], config["password"]))
            forms = response.json()
            form_count = 0
            for form in forms:
                try:
                    copy_form = form.copy()
                    del copy_form[prefix]
                    all_keys = all_keys.union(copy_form.keys())
                    for key in keys.keys():
                        value = form.get(key, None)
                        if value is None:
                            value = form[prefix][0]["%s/%s" % (prefix, key)]
                        copy_form[keys[key]] = value
                    count = 1
                    for sub_part in form[prefix]:
                        for k in sub_part.keys():
                            new_key = "%s[%d]/%s" % (prefix, count, k[len(prefix) + 1 :])
                            all_keys.add(new_key)
                            copy_form[new_key] = sub_part[k]
                        count += 1
                    copy_form["type"] = prefix
                    res.append(copy_form)
                except Exception as e:
                    print("failed on ", e, form, prefix)
                    failure_count += 1
                form_count += 1

        print("parsed:", len(res), "failed:", failure_count)
        print("all_keys", all_keys)

        all_keys = sorted(list(all_keys))
        all_keys.insert(0, "type")
        if not as_csv:
            for item in res:
                for k in all_keys:
                    if k not in item:
                        item[k] = None
            return JsonResponse(res, safe=False)
        else:
            response = HttpResponse(content_type="text/csv")

            writer = csv.writer(response)
            writer.writerow(all_keys)
            i = 1
            for item in res:
                ar = [item.get(key, None) for key in all_keys]
                writer.writerow(ar)
                i += 1
                if i % 100 == 0:
                    print(i)
            return response


def get_campaigns_per_country(country_name):
    country = OrgUnit.objects.get(org_unit_type__category="COUNTRY", name__iexact=country_name)
    res = []
    # definitely probably doable with something more efficient, sql-wise, but this works.
    for c in list(Campaign.objects.all().select_related("initial_org_unit__parent__parent")):
        parent = c.initial_org_unit
        while parent:
            if parent.id == country.id:
                res.append(c)
            parent = parent.parent
    return res


class LQASViewSet(viewsets.ViewSet):
    """
           Endpoint used to transform IM (independent monitoring) data from existing ODK forms stored in ONA. Very custom to the polio project.

    sample Config:

    configs = [
           {
               "url": 'https://brol.com/api/v1/data/5888',
               "login": "qmsdkljf",
               "password": "qmsdlfj"
               "country": "Liberia",
               "district_column": "health_district",
               "region_column": "county"
           },
           {
               "url":  'https://brol.com/api/v1/data/5887',
               "login": "qmsldkjf",
               "password": "qsdfmlkj"
               "country": "Sierra Leone",
               "district_column": "district",
               "region_column": "chiefdom"
           }
       ]
    """

    def list(self, request):
        slug = request.GET.get("country", None)
        as_csv = request.GET.get("format", None) == "csv"
        configs = get_object_or_404(Config, slug="lqas")
        country_summary = {}
        for config in configs.content:
            print(config)
            country = config["country"]
            print("----------------", country)
            campaigns = get_campaigns_per_country(country)
            print("get_campaigns_per_country get", get_campaigns_per_country(country))
            response = requests.get(config["url"], auth=(config["login"], config["password"]))
            forms = response.json()

            district_column = config["district_column"]
            region_column = config["region_column"]

            d_ = lambda: defaultdict(dict)
            d__ = lambda: defaultdict(d_)
            d___ = lambda: defaultdict(d__)
            summary_lqas = defaultdict(d___)
            count_absent_district = 0
            for form in forms:
                form["lqas_country"] = country
                region = form.get(region_column, None)
                district = form.get(district_column, None)

                if region and district:
                    for i in range(1, 11):
                        key = "FM_Child%d" % i
                        fm = form.get(key, None)
                        today_string = form.get("today", None)
                        today = datetime.datetime.strptime(today_string, "%Y-%m-%d").date()
                        # print(today)
                        round = ""
                        campaign = ""
                        for c in campaigns:
                            if (
                                c.round_two
                                and c.round_two.started_at
                                and c.round_two.ended_at
                                and today >= c.round_two.started_at
                                and today <= c.round_two.ended_at + datetime.timedelta(days=30)
                            ):
                                round = 2
                                campaign = c.obr_name
                                break
                            if (
                                c.round_one
                                and c.round_one.started_at
                                and c.round_one.ended_at
                                and today >= c.round_one.started_at
                                and today <= c.round_one.ended_at + datetime.timedelta(days=30)
                            ):
                                round = 1
                                campaign = c.obr_name
                        # print(key, fm)
                        if round and campaign:
                            # print("campaign", campaign, round)
                            if not summary_lqas[campaign][round][region][district]:
                                summary_lqas[campaign][round][region][district] = {"fm": 0, "children": 0}
                            if fm is None:
                                pass  # print("no fm for key", key, form)
                            else:
                                summary_lqas[campaign][round][region][district]["children"] = (
                                    summary_lqas[campaign][round][region][district]["children"] + 1
                                )
                            if fm == "Y":
                                summary_lqas[campaign][round][region][district]["fm"] = (
                                    summary_lqas[campaign][round][region][district]["fm"] + 1
                                )
                else:
                    # print("------------------- no region or district", form)
                    count_absent_district += 1
            print(len(forms))
            print(json.dumps(summary_lqas, indent=2))
            country_summary[country] = summary_lqas

        return JsonResponse(country_summary, safe=False)


router = routers.SimpleRouter()
router.register(r"polio/campaigns", CampaignViewSet, basename="Campaign")
router.register(r"polio/im", IMViewSet, basename="IM")
router.register(r"polio/lqas", LQASViewSet, basename="LQAS")

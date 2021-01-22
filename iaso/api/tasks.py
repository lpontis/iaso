from rest_framework import viewsets, permissions, serializers
from rest_framework.response import Response
from django.contrib.auth.models import User

from .common import HasPermission, ModelViewSet, TimestampField
from iaso.models import Task


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name", "last_name", "username"]


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task

        fields = [
            "id",
            "created_at",
            "started_at",
            "ended_at",
            "progress_value",
            "end_value",
            "launcher",
            "result",
            "status",
            "name",
            "params",
            "should_be_killed",
            "progress_message",
        ]

        read_only_fields = ["launcher_name"]

    launcher = UserSerializer(read_only=True)
    ended_at = TimestampField(read_only=True)
    created_at = TimestampField(read_only=True)
    started_at = TimestampField(read_only=True)


class TaskSourceViewSet(ModelViewSet):
    """ Task API

    GET /api/tasks/
    GET /api/tasks/<id>
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TaskSerializer
    results_key = "sources"
    queryset = Task.objects.all()
    http_method_names = ["get", "head", "options", "trace"]

    def get_queryset(self):
        profile = self.request.user.iaso_profile
        return Task.objects.filter(account=profile.account)

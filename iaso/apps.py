from django.apps import AppConfig

class IasoConfig(AppConfig):
    name = "iaso"

    def ready(self):
        import iaso.api.signals

from django.db.models import signals
from django.dispatch import receiver
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
import logging

from iaso.models import Form

logger = logging.getLogger(__name__)

@receiver(signals.post_save, sender=Form)
def send_form_email(sender, **kwargs):
    created = kwargs['created']
    form = kwargs['instance']

    logger.warning('SIGNAL send_form_email')

    if created:
        subject = 'A form has just been created...'

        body_html = 'Hello there! <br /><br />'
        body_html += 'A form has just been created: <strong>%s</strong> <br /><br />' % form.name
        body_html += 'Enjoy!'

        body_text = strip_tags(body_html)

        message = EmailMultiAlternatives(subject=subject, body=body_text, from_email='Iaso <iaso@bluesquare.org>',
                                         to=['vincent.battaglia@gmail.com'])
        message.attach_alternative(body_html, "text/html")

        message.send()
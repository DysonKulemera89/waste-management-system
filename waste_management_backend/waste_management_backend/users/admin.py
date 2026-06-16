from django.contrib import admin
from .models import Complaint, Payment, Notifications
from .models import WasteBin


# Register your models
admin.site.register(Complaint)
admin.site.register(Payment)
admin.site.register(Notifications)
admin.site.register(WasteBin)
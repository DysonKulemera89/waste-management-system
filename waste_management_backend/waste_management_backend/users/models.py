from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
import qrcode
from io import BytesIO
from django.core.files import File

class WasteBin(models.Model):
    bin_code = models.CharField(max_length=50, unique=True)
    location = models.CharField(max_length=200)
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True)

    def save(self, *args, **kwargs):

        qr_data = f"Bin Code: {self.bin_code} | Location: {self.location}"

        qr_image = qrcode.make(qr_data)

        qr_offset = BytesIO()
        qr_image.save(qr_offset, format='PNG')

        file_name = f"{self.bin_code}.png"

        self.qr_code.save(
            file_name,
            File(qr_offset),
            save=False
        )

        super().save(*args, **kwargs)

    def __str__(self):
        return self.bin_code

# SCHEDULE MODEL
class Schedule(models.Model):

    DAYS = [
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
        ('Sunday', 'Sunday'),
    ]

    area = models.CharField(max_length=100)
    day = models.CharField(max_length=10, choices=DAYS)
    status = models.CharField(max_length=20, default="scheduled")

    def __str__(self):
        return f"{self.area} - {self.day}"
    
class Profile(models.Model):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('resident', 'Resident'),
    )

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='resident')

    def __str__(self):
        return f"{self.user.username} - {self.role}"
    
# CUSTOM USER MODEL
class User(AbstractUser):
    ROLE_CHOICES = (
        ('resident', 'Resident'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='resident')
    phone = models.CharField(max_length=20, null=True, blank=True)
    area = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.username

# NOTIFICATIONS MODEL
class Notifications(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    message = models.TextField()

    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message

# COMPLAINT MODEL
class Complaint(models.Model):

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    description = models.TextField()
    image = models.ImageField(upload_to='complaints/', null=True, blank=True)

    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.status}"


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)    
        
class Payment(models.Model):
    PAYMENT_STATUS = (
        ('Pending', 'Pending'),
        ('Paid', 'Paid'),
        ('Failed', 'Failed'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    amount = models.DecimalField(max_digits=10, decimal_places=2)

    transaction_id = models.CharField(max_length=100, unique=True)

    payment_method = models.CharField(max_length=50)

    status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS,
        default='Pending'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.amount}"    
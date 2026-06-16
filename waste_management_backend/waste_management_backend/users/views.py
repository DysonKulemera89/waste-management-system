import joblib
import numpy as np
from notifications.models import Notification
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .models import Schedule
from .serializers import ScheduleSerializer
from django.db.models import Case, When, Value, IntegerField
from .models import Profile
from .models import Complaint
from .serializers import ComplaintSerializer
from django.core.mail import send_mail
from .models import Payment
from .serializers import PaymentSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import uuid
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from uuid import uuid4
from notifications.sms_service import send_sms
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Notifications
from .serializers import NotificationSerializer
from django.core.mail import send_mail
from django.conf import settings

from django.contrib.auth import get_user_model
from rest_framework.permissions import BasePermission
from .models import Complaint, Payment, Notifications, WasteBin
from .serializers import (
    RegisterSerializer,
    ComplaintSerializer,
    PaymentSerializer,
    NotificationsSerializer
)

User = get_user_model()

@api_view(['GET'])
def get_users(request):

    users = User.objects.all()

    data = []

    for user in users:
        data.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "phone": getattr(user, "phone", ""),
            "area": getattr(user, "area", ""),
            "role": getattr(user, "role", "resident")
        })

    return Response(data)

# LOAD AI MODELS
model = joblib.load("ai_model/waste_model.pkl")
hotspot_model = joblib.load("ai_model/hotspot_model.pkl")

class IsAdminUserRole(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

# USER REGISTRATION
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    
class ComplaintCreateView(generics.CreateAPIView):

    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):

        complaint = serializer.save(
            user=self.request.user
        )

        # Create in-app notification
        Notifications.objects.create(
            user=self.request.user,
            message="Your complaint has been submitted successfully."
        )

        # Send email notification
        if self.request.user.email:

            send_mail(
                "Complaint Submitted",
                f"""
Dear {self.request.user.username},

Your complaint has been submitted successfully.

Complaint:
{complaint.description}

Status:
Pending

Thank you for using the Smart Waste Management System.
                """,
                settings.DEFAULT_FROM_EMAIL,
                [self.request.user.email],
                fail_silently=False,
            )
# SCHEDULE
# Everyone can VIEW schedule
class ScheduleListView(generics.ListAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated]   

# CREATE SCHEDULE (Admin)
# Only ADMIN can CREATE schedule
class ScheduleCreateView(generics.CreateAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    queryset = Schedule.objects.annotate(
        day_order=Case(
            When(day='Monday', then=Value(1)),
            When(day='Tuesday', then=Value(2)),
            When(day='Wednesday', then=Value(3)),
            When(day='Thursday', then=Value(4)),
            When(day='Friday', then=Value(5)),
            When(day='Saturday', then=Value(6)),
            When(day='Sunday', then=Value(7)),
            output_field=IntegerField()
        )
    ).order_by('day_order')

class ScheduleCreateView(generics.CreateAPIView):
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def perform_create(self, serializer):
        schedule = serializer.save()

        # Find residents in the same area
        residents = User.objects.filter(area=schedule.area)

        # Create notifications for EACH resident
        for resident in residents:
            Notifications.objects.create(
                user=resident,
                message=(
                    f"📱 SMS ALERT: Waste collection in "
                    f"{schedule.area} is scheduled on {schedule.day}."
                )
            )
            if resident.email:
                send_mail(
                     "Waste Collection Schedule",
                     f"""
            Dear {resident.username},
            Waste collection for {schedule.area}is scheduled on {schedule.day}.
            Please prepare your waste bins.
            Waste Management System
                  """,
                   settings.DEFAULT_FROM_EMAIL,
                   [resident.email],
                   fail_silently=False,
            )

# LIST SCHEDULES (Residents)
class ScheduleListView(generics.ListAPIView):
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated,]

    queryset = Schedule.objects.annotate(
        day_order=Case(
            When(day='Monday', then=Value(1)),
            When(day='Tuesday', then=Value(2)),
            When(day='Wednesday', then=Value(3)),
            When(day='Thursday', then=Value(4)),
            When(day='Friday', then=Value(5)),
            When(day='Saturday', then=Value(6)),
            When(day='Sunday', then=Value(7)),
            output_field=IntegerField()
        )
    ).order_by('day_order')
    
@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    role = request.data.get('role', 'resident')  # default

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    # Set role
    profile = user.profile
    profile.role = role
    profile.save()

    token, _ = Token.objects.get_or_create(user=user)

    return Response({
        "token": token.key,
        "role": profile.role
    })    
    

# LOGIN
@api_view(['POST'])
def login_user(request):
    username = request.data.get("username")
    password = request.data.get("password")

    print("DATA RECEIVED:", request.data)

    if not username or not password:
        return Response({"error": "Username and password required"}, status=400)

    try:
        user = User.objects.get(username=username)

        if user.check_password(password):
            token, _ = Token.objects.get_or_create(user=user)

            return Response({
                "token": token.key,
                "username": user.username,
                "role": user.role
            })
        else:
            return Response({"error": "Invalid password"}, status=401)

    except User.DoesNotExist:
        return Response({"error": "User does not exist"}, status=404)

# COMPLAINTS
class ComplaintListView(generics.ListAPIView):
    serializer_class = ComplaintSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == "admin":
            return Complaint.objects.all().order_by("-created_at")

        return Complaint.objects.filter(
            user=self.request.user
        ).order_by("-created_at")
# PAYMENTS
class PaymentCreateView(generics.CreateAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_payments(request):

    payments = Payment.objects.all().order_by('-created_at')

    serializer = PaymentSerializer(
        payments,
        many=True
    )

    return Response(serializer.data)

# NOTIFICATIONS
class NotificationsListView(generics.ListAPIView):
    queryset = Notifications.objects.all()
    serializer_class = NotificationsSerializer
    permission_classes = [IsAuthenticated]


class NotificationsCreateView(generics.CreateAPIView):
    queryset = Notifications.objects.all()
    serializer_class = NotificationsSerializer
    permission_classes = [IsAuthenticated, IsAdminUserRole]

# AI WASTE PREDICTION
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def predict_waste(request):

    complaints = request.data.get("complaints", 0)
    days = request.data.get("days_since_collection", 0)
    population = request.data.get("population_density", 0)

    features = np.array([[complaints, days, population]])
    prediction = model.predict(features)[0]

    # SMART ALERT SYSTEM
    if prediction > 70:
        message = "🚨 High waste level detected! Immediate action required."
    elif prediction > 40:
        message = "⚠️ Waste level rising. Collection may be needed soon."
    else:
        message = "✅ Waste level is under control."

    Notifications.objects.create(
        user=request.user,
        message=message
    )

    return Response({
        "predicted_waste_level": prediction
    })

# HOTSPOTS
@api_view(['POST'])
def detect_hotspots(request):

    complaints = request.data.get("complaints", 0)
    population = request.data.get("population_density", 0)

    data = np.array([[complaints, population]])
    cluster = hotspot_model.predict(data)

    return Response({
        "hotspot_cluster": int(cluster[0]),
        "message": "Area waste level analyzed successfully"
    })


@api_view(['GET'])
def get_hotspots(request):

    complaints = Complaint.objects.exclude(latitude=None)

    data = [[c.latitude, c.longitude] for c in complaints]

    if not data:
        return Response([])

    data = np.array(data)
    clusters = hotspot_model.predict(data)

    results = []
    for i, c in enumerate(complaints):
        results.append({
            "lat": c.latitude,
            "lng": c.longitude,
            "cluster": int(clusters[i])
        })

    return Response(results)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_residents(request):
    residents = User.objects.filter(role='resident')

    data = []
    for user in residents:
        data.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "phone": getattr(user, "phone", ""),
            "role": user.role
        })

    return Response(data)

# DASHBOARD
@api_view(['GET'])
def dashboard_stats(request):
    return Response({
        "total_residents": User.objects.count(),
        "total_complaints": Complaint.objects.count(),
        "total_payments": Payment.objects.count(),
        "total_notifications": Notification.objects.count(),
    })
    
@api_view(['GET'])
def notifications(request):
    data = Notifications.objects.all().order_by('-created_at')

    results = []

    for n in data:
        results.append({
            "id": n.id,
            "message": n.message,
            "is_read": n.is_read,
            "created_at": n.created_at
        })

    return Response(results)    

@api_view(['POST'])
def make_payment(request):

    user = request.user

    amount = request.data.get('amount')
    payment_method = request.data.get('payment_method')

    payment = Payment.objects.create(
        user=user,
        amount=amount,
        payment_method=payment_method,
        transaction_id=str(uuid.uuid4())[:10],
        status='Paid'
    )

    serializer = PaymentSerializer(payment)

    return Response({
        "message": "Payment successful",
        "payment": serializer.data
    }, status=status.HTTP_201_CREATED)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payment_history(request):

    payments = Payment.objects.filter(user=request.user)

    serializer = PaymentSerializer(payments, many=True)

    return Response(serializer.data)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def simulate_payment(request):

    user = request.user

    amount = request.data.get('amount')
    payment_method = request.data.get('payment_method')

    payment = Payment.objects.create(
        user=user,
        amount=amount,
        payment_method=payment_method,
        transaction_id=str(uuid4()),
        status='Paid'
    )

    # Create in-app notification
    Notifications.objects.create(
        user=user,
        message=f"Payment of MWK {amount} was successful."
    )

    # Send email notification
    if user.email:
        send_mail(
            "Payment Successful",
            f"""
Dear {user.username},

Your payment of MWK {amount} was successful.

Transaction ID:
{payment.transaction_id}

Payment Method:
{payment_method}

Status:
Paid

Thank you for using the Smart Waste Management System.
            """,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )

    return Response({
        "message": "Payment completed successfully",
        "transaction_id": payment.transaction_id,
        "status": payment.status
    })
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirm_payment(request, transaction_id):

    try:
        payment = Payment.objects.get(
            transaction_id=transaction_id
        )

        payment.status = "Paid"
        payment.save()

        # In-app notification
        Notifications.objects.create(
            user=payment.user,
            message=f"Your payment of MWK {payment.amount} was successful."
        )

        # SMS notification
        send_sms(
            payment.user.phone,
            f"Payment of MWK {payment.amount} received successfully."
        )

        # Email notification
        if payment.user.email:
            send_mail(
                "Payment Confirmation",
                f"""
Dear {payment.user.username},

Your payment has been confirmed successfully.

Amount:
MWK {payment.amount}

Transaction ID:
{payment.transaction_id}

Payment Method:
{payment.payment_method}

Status:
{payment.status}

Thank you for using the Smart Waste Management System.

Regards,
Waste Management Team
                """,
                settings.DEFAULT_FROM_EMAIL,
                [payment.user.email],
                fail_silently=False,
            )

        return Response({
            "message": "Payment successful",
            "transaction_id": payment.transaction_id,
            "status": payment.status
        })

    except Payment.DoesNotExist:
        return Response(
            {"error": "Payment not found"},
            status=404
        )        
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):

    notifications = Notifications.objects.filter(
        user=request.user
    ).order_by('-created_at')

    serializer = NotificationSerializer(
        notifications,
        many=True
    )

    return Response(serializer.data)
@api_view(['PUT'])
def mark_notification_read(request, pk):

    try:
        notification = Notifications.objects.get(
            id=pk,
        
        )

        notification.is_read = True
        notification.save()

        return Response({
            "message": "Notification marked as read"
        })

    except Notifications.DoesNotExist:
        return Response(
            {"error": "Notification not found"},
            status=404
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_notification(request):

    notification = Notifications.objects.create(
        user=request.user,
        message=request.data.get('message')
    )

    # Email notification
    if request.user.email:
        send_mail(
            "Smart Waste Management Notification",
            f"""
Dear {request.user.username},

You have received a new notification:

{notification.message}

Regards,
Smart Waste Management System
            """,
            settings.DEFAULT_FROM_EMAIL,
            [request.user.email],
            fail_silently=False,
        )

    # SMS notification (optional)
    if request.user.phone:
        send_sms(
            request.user.phone,
            notification.message
        )

    return Response({
        "message": "Notification created successfully",
        "notification_id": notification.id
    })
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def unread_notifications(request):

    count = Notifications.objects.filter(
        user=request.user,
        is_read=False
    ).count()

    return Response({
        "unread_count": count
    })
   
@api_view(['GET'])
def dashboard_stats(request):

    return Response({
        "total_complaints": Complaint.objects.count(),
        "total_payments": Payment.objects.count(),
        "total_notifications": Notifications.objects.count(),
        "total_bins": WasteBin.objects.count()
    })
    
@api_view(['GET'])
def reports(request):

    payments = Payment.objects.filter(status='Paid').count()

    complaints = Complaint.objects.count()

    notifications = Notifications.objects.count()

    return Response({
        "payments_received": payments,
        "complaints_received": complaints,
        "notifications_sent": notifications
    })
    
@api_view(['GET'])
def dashboard_stats(request):

    total_complaints = Complaint.objects.count()
    total_payments = Payment.objects.count()
    total_notifications = Notifications.objects.count()
    total_bins = WasteBin.objects.count()

    return Response({
        "total_complaints": total_complaints,
        "total_payments": total_payments,
        "total_notifications": total_notifications,
        "total_bins": total_bins
    })
    
@api_view(['GET'])
def reports(request):

    total_paid = Payment.objects.filter(
        status='Paid'
    )

    total_amount = sum(
        payment.amount
        for payment in total_paid
    )

    return Response({
        "total_complaints": Complaint.objects.count(),
        "total_payments": total_paid.count(),
        "total_notifications": Notifications.objects.count(),
        "total_revenue": total_amount
    })
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def resolve_complaint(request, pk):

    try:
        complaint = Complaint.objects.get(id=pk)

        complaint.status = "resolved"
        complaint.save()

        # In-app notification
        Notifications.objects.create(
            user=complaint.user,
            message="✅ Your complaint has been resolved."
        )

        # Email notification
        if complaint.user.email:
            send_mail(
                "Complaint Resolved",
                f"""
Dear {complaint.user.username},

Your complaint has been resolved successfully.

Complaint:
{complaint.description}

Status:
Resolved

Thank you for using the Smart Waste Management System.
                """,
                settings.DEFAULT_FROM_EMAIL,
                [complaint.user.email],
                fail_silently=False,
            )

        return Response({
            "message": "Complaint resolved successfully"
        })

    except Complaint.DoesNotExist:
        return Response(
            {"error": "Complaint not found"},
            status=404
        )
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def resolve_complaint(request, pk):

    complaint = Complaint.objects.get(pk=pk)

    complaint.status = "resolved"
    complaint.save()

    send_mail(
        "Complaint Resolved",
        f"""
Dear {complaint.user.username},

Your complaint has been resolved.

Complaint:
{complaint.description}

Thank you for using our system.
        """,
        settings.DEFAULT_FROM_EMAIL,
        [complaint.user.email],
        fail_silently=False,
    )

    return Response({
        "message": "Complaint resolved successfully"
    })
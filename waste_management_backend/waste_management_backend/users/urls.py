from django.urls import path
from .views import make_payment, payment_history
from .views import simulate_payment
from .views import confirm_payment
from .views import resolve_complaint
from .views import dashboard_stats
from .views import (
    login_user,
    RegisterView,
    dashboard_stats,
    ComplaintCreateView,
    ComplaintListView,
    PaymentCreateView,
    get_payments,
    NotificationsListView,
    ScheduleCreateView,
    ScheduleListView,
    get_users,
    reports
)
from .views import (
    get_notifications,
    mark_notification_read,
    create_notification,
    unread_notifications,
)

urlpatterns = [
    # AUTH
    path('login/', login_user),
    
    path('register/', RegisterView.as_view()),
    
    # USERS
    path('users/', get_users),

    # DASHBOARD
    path('dashboard/', dashboard_stats),

    # COMPLAINTS
    path('complaints/create/', ComplaintCreateView.as_view()),
    path('complaints/', ComplaintListView.as_view()),

    # PAYMENTS
    path('payments/create/', PaymentCreateView.as_view()),
    path('payments/', get_payments),
    path('payments/make/', make_payment),
    
    # SCHEDULES
    path('schedule/create/', ScheduleCreateView.as_view()),
    path('schedule/', ScheduleListView.as_view()),
    
    path('payment-history/', payment_history),
    path('simulate-payment/',simulate_payment),

    path('confirm-payment/<str:transaction_id>/',confirm_payment),
    path('notifications/',get_notifications),

    path('notifications/<int:pk>/read/',mark_notification_read),

    path('notifications/create/',create_notification),

    path('notifications/unread-count/',unread_notifications),
    path('dashboard-stats/',dashboard_stats),
    path('reports/',reports),
    path('dashboard-stats/',dashboard_stats),
    path('complaints/<int:pk>/resolve/',resolve_complaint),
    
]
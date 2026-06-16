from rest_framework.decorators import api_view
from rest_framework.response import Response
from .sms_service import send_sms


@api_view(['GET'])
def test_notification(request):

    response = send_sms(
        "+265888294909",
        "Hello Dyson! Your Waste Management SMS system is working successfully."
    )

    return Response({
        "status": "SMS Sent",
        "response": str(response)
    })
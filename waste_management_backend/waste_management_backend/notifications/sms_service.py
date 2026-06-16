import africastalking

# Sandbox credentials
username = "waste-management-system"
api_key = "atsk_f0ceb68614fa44798b7fd33c60071691fd6b93a0bc4087f24c02073864a3c1788e630c76"
# Initialize SDK
africastalking.initialize(username, api_key)

sms = africastalking.SMS

def send_sms(phone_number, message):
    try:
        response = sms.send(message, [phone_number])

        print("SMS sent successfully")
        print(response)

        return response

    except Exception as e:
        print(f"Error sending SMS: {e}")
        return None
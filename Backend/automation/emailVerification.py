import smtplib
from email.mime.text import MIMEText


sender = 'dermascanteam@warmy.io'
receivers = ['jamesdavidguba2@gmail.com']

msg = """   From: From Mailtrap Club 
            To: To User 
            Subject: Test Mail from Mailtrap Club
    
            This is a test email sent from Mailtrap Club using SMTP server.
    """

host = 'live.smtp.mailtrap.io'
port = 587
user = 'api'
password = '3dedc098db1c49b59fca18508c0391aa'


with smtplib.SMTP(host, port) as server:
    server.ehlo()
    server.starttls()
    server.login(user, password)
    server.sendmail(sender, receivers, msg)

print("Successfully sent email")
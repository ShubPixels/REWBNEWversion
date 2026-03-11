from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)

load_dotenv()

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
RECIPIENT_EMAIL = "vatan@ranganiindia.com"

@app.route("/")
def home():
    return jsonify({"message": "Welcome to the Contact Form API! Use /api/contact to submit a form."})

@app.route("/api/contact", methods=["POST"])
def contact():
    try:
        data = request.get_json()
        name = data.get("name")
        email = data.get("email")
        phone = data.get("phone")
        company = data.get("company")
        country = data.get("country")
        state = data.get("state")
        city = data.get("city")
        category = data.get("category")
        message = data.get("message")

        subject = f"New Contact Form Submission - {category}"
        body = f"""
        New Contact Form Submission:

        Name: {name}
        Email: {email}
        Phone: {phone}
        Company: {company}
        Country: {country}
        State: {state}
        City: {city}
        Category: {category}
        Message: {message}
        """

        msg = MIMEMultipart()
        msg["From"] = EMAIL_ADDRESS
        msg["To"] = RECIPIENT_EMAIL
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.sendmail(EMAIL_ADDRESS, RECIPIENT_EMAIL, msg.as_string())

        return jsonify({"message": "Email sent successfully"}), 200

    except Exception as e:
        print(f"Error in /api/contact: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/test-smtp")
def test_smtp():
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            return jsonify({"message": "SMTP connection successful"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
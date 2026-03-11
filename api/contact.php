<?php
file_put_contents("debug_php_output.txt", print_r($_SERVER, true) . "\n\n" . file_get_contents("php://input"));

// contact.php

// --- Security and CORS Setup ---
header("Access-Control-Allow-Origin: https://ranganiindia.com");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight requests (CORS OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Simulate browser form header for some security systems
if (empty($_SERVER['HTTP_USER_AGENT'])) {
  header('HTTP/1.1 403 Forbidden');
  echo json_encode(["error" => "Invalid request source"]);
  exit;
}

// --- Read Input (Handles JSON or Form Data) ---
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

// If JSON, convert to $_POST format
if ($data && is_array($data)) {
    $_POST = $data;
}

// --- Validate Request Type ---
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Only POST requests are allowed."]);
    exit;
}

// --- Required Fields Validation ---
$required_fields = ['name', 'email', 'company', 'country', 'state', 'city'];
foreach ($required_fields as $field) {
    if (empty($_POST[$field])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing required field: $field"]);
        exit;
    }
}

// --- Collect Data ---
$name = htmlspecialchars(trim($_POST['name']));
$email = htmlspecialchars(trim($_POST['email']));
$phone = htmlspecialchars(trim($_POST['phone'] ?? ''));
$company = htmlspecialchars(trim($_POST['company']));
$country = htmlspecialchars(trim($_POST['country']));
$state = htmlspecialchars(trim($_POST['state']));
$city = htmlspecialchars(trim($_POST['city']));
$category = htmlspecialchars(trim($_POST['category'] ?? 'General Inquiry'));
$message = htmlspecialchars(trim($_POST['message'] ?? ''));

// --- Email Setup ---
$to = "mail@ranganiindia.com"; // Change this to your desired email
$subject = "New Contact Form Submission - $category";
$body = "
You have received a new contact form submission from Rangani India website.

Name: $name
Email: $email
Phone: $phone
Company: $company
Country: $country
State: $state
City: $city
Category: $category

Message:
$message
";

$headers = "From: noreply@ranganiindia.com\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// --- Send Email ---
if (mail($to, $subject, $body, $headers)) {
    http_response_code(200);
    echo json_encode(["message" => "Your message has been sent successfully!"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to send email. Please try again later."]);
}
?>

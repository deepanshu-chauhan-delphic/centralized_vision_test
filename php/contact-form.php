<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

function response($success, $message, $statusCode = 200)
{
    http_response_code($statusCode);
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    response(false, "Method not allowed. Please use POST method.", 405);
}

require_once __DIR__ . '/helper.php';

$firstName = htmlspecialchars(trim($_POST['firstName'] ?? ''));
$lastName  = htmlspecialchars(trim($_POST['lastName'] ?? ''));
$email     = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
$help      = htmlsp ecialchars(trim($_POST['help'] ?? ''));
$msg       = htmlspecialchars(trim($_POST['msg'] ?? ''));

if (!$firstName || !$lastName || !$email ||  !$help || !$msg) {
    response(false, "Please fill in all required fields.", 400);
}

$body = "
<h3>New Contact Form Submission</h3>
<p><strong>Name:</strong> {$firstName} {$lastName}</p>
<p><strong>Email:</strong> {$email}</p>
<p><strong>How Can We Help You?:</strong> {$help}</p>
<p><strong>Message:</strong><br>{$msg}</p>
";

$send = sendEmail($body, 'Contact Form Submission from Centralized Vision Website', 'contact', $help);

if ($send !== true) {
    response(false, $send, 500);
} else {
    response(true, "Thank you for contacting us. We will get back to you soon.");
}

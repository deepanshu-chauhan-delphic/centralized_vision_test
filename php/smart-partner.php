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

$conName = htmlspecialchars(trim($_POST['conName'] ?? ''));
$title  = htmlspecialchars(trim($_POST['title'] ?? ''));
$email     = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
$comName      = htmlspecialchars(trim($_POST['comName'] ?? ''));
$phone       = htmlspecialchars(trim($_POST['phone'] ?? ''));

if (!$conName || !$title || !$email || !$comName || !$phone) {
    response(false, "Please fill in all required fields.", 400);
}

$body = "<h3>New Smart Partner Form Submission</h3>
<p><strong>Contact Name:</strong> {$conName}</p>
<p><strong>Title:</strong> {$title}</p>
<p><strong>Email:</strong> {$email}</p>
<p><strong>Company Name:</strong> {$comName}</p>
<p><strong>Phone:</strong> {$phone}</p>";

$send = sendEmail($body, 'Smart Partner Form Submission from Centralized Vision Website', 'smart_partner');

if ($send !== true) {
    response(false, $send, 500);
} else {
    response(true, "Thank you for your interest in becoming a Smart Partner. We will get back to you soon.");
}

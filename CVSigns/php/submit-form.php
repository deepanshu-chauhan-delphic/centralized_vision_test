<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

use Dompdf\Dompdf;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/config.php';
require __DIR__ . '/helpers.php';

$response = ['success' => false, 'message' => ''];
$action = isset($_POST['action']) ? $_POST['action'] : '';
try {
    $formData = [
        'virtual_guard' => [
            'aluminum_signs' => processSignData($_POST, 'aluminum'),
            'window_decals' => processSignData($_POST, 'decal'),
            'sticker_signs' => processSignData($_POST, 'sticker')
        ],
        'virtual_greeter' => [
            'signs' => processSignData($_POST, 'greeter'),
            'sign_text' => filter_input(INPUT_POST, 'sign_text', FILTER_SANITIZE_STRING),
            'logo_uploaded' => !empty($_FILES['logo_upload']['name'])
        ],
        'shipping_info' => [
            'property_name' => filter_input(INPUT_POST, 'property_name', FILTER_SANITIZE_STRING),
            'first_name' => filter_input(INPUT_POST, 'first_name', FILTER_SANITIZE_STRING),
            'last_name' => filter_input(INPUT_POST, 'last_name', FILTER_SANITIZE_STRING),
            'shipping_address' => filter_input(INPUT_POST, 'shipping_address', FILTER_SANITIZE_STRING),
            'state' => filter_input(INPUT_POST, 'state', FILTER_SANITIZE_STRING),
            'city' => filter_input(INPUT_POST, 'city', FILTER_SANITIZE_STRING),
            'zip_code' => filter_input(INPUT_POST, 'zip_code', FILTER_SANITIZE_STRING),
            'email' => filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL),
            'phone' => filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING)
        ]
    ];


    if (!empty($_FILES['logo_upload']['name'])) {
        $uploadDir = 'uploads/';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $allowedTypes = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png'
        ];
        $fileInfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($fileInfo, $_FILES['logo_upload']['tmp_name']);

        if (!array_key_exists($mimeType, $allowedTypes)) {
            throw new Exception('Invalid file type. Only JPG and PNG are allowed.');
        }

        $ext = $allowedTypes[$mimeType];
        $uniqueName = time() . '_' . bin2hex(random_bytes(5)) . '.' . $ext;
        $uploadPath = $uploadDir . $uniqueName;

        if (!move_uploaded_file($_FILES['logo_upload']['tmp_name'], $uploadPath)) {
            throw new Exception('Failed to upload file.');
        }

        $formData['virtual_greeter']['logo_url'] = BASE_URL . $uploadPath;
    }

    if ($action == 'submit') {
        $emailSent = sendFormEmail($formData);

        if (!$emailSent) {
            throw new Exception('Failed to send email notification.');
        }

        $response = [
            'success' => true,
            'message' => 'Form submitted successfully!',
            'data' => $formData
        ];
    } elseif ($action == 'generate-pdf') {
        sendFormEmail($formData);
        ob_start();
        include 'generate-pdf.php';
        $html = ob_get_clean();


        $dompdf = new Dompdf();
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $response = [
            'success' => true,
            'message' => 'PDF generated and email sent successfully!',
            'pdf_data' => base64_encode($dompdf->output())
        ];
    } elseif ($action == 'print') {
        ob_start();
        include 'generate-pdf.php';
        $html = ob_get_clean();
        header('Content-Type: text/html');
        echo $html;
        exit;
    }
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    http_response_code(500);
}

echo json_encode($response);



function sendFormEmail($formData)
{
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host       = SMTP_HOST;
        $mail->SMTPAuth   = true;
        $mail->Username   = SMTP_USERNAME;
        $mail->Password   = SMTP_PASSWORD;
        $mail->SMTPSecure = SMTP_ENCRYPTION;
        $mail->Port       = SMTP_PORT;

        $mail->setFrom(SMTP_FROM_EMAIL, SMTP_FROM_NAME);
        $mail->addAddress(SMTP_TO_EMAIL);

        $cc_emails = explode(',', SMTP_CC_EMAILS);

        // Add CC email addresses
        foreach ($cc_emails as $cc) {
            $mail->addCC($cc);
        }

        $mail->isHTML(true);
        $mail->Subject = 'New Virtual Guard/Greeter Order Submission';
        $mail->Body    = buildFormEmailHtml($formData);

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Mailer Error: {$mail->ErrorInfo}");
        return false;
    }
}

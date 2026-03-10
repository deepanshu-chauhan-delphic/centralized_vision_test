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

require __DIR__ . '/../vendor/autoload.php';

use Dompdf\Dompdf;

$response = ['success' => false, 'message' => ''];
$action = isset($_POST['action']) ? $_POST['action'] : '';

try {
    $formData = $_POST;
    unset($formData['action']);
    if ($action === 'print') {
        ob_start();
        include __DIR__ . '/cv-partner-pricing-pdf.php';
        $html = ob_get_clean();
        header('Content-Type: text/html');
        echo $html;
        exit;
    } else {
        ob_start();
        include __DIR__ . '/cv-partner-pricing-pdf.php';
        $html = ob_get_clean();

        $dompdf = new Dompdf();
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $response = [
            'success' => true,
            'message' => 'PDF generated successfully!',
            'pdf_data' => base64_encode($dompdf->output())
        ];
    }
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    http_response_code(500);
}

echo json_encode($response);

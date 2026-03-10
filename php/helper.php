<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function sendEmail($body, $subject, $form = null, $data = null)
{
    require __DIR__ . '/../vendor/autoload.php';
    require_once __DIR__ . '/config.php';

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
        if (!is_null($form) && $form == 'contact') {
            if (!is_null($data) && ($data == 'Sales' || $data == 'Smart Partner')) {
                $mail->addAddress(SMTP_TO_INFO_EMAIL);
            } else {
                $mail->addAddress(SMTP_TO_SUPPORT_EMAIL);
            }
        } else {
            $mail->addAddress(SMTP_TO_INFO_EMAIL);
        }

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $body;

        return $mail->send();
    } catch (Exception $e) {
        return "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}

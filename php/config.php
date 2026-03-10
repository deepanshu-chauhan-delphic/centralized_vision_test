<?php
// SMTP Configuration (set via environment variables on Render)
define('SMTP_HOST', getenv('SMTP_HOST') ?: '');
define('SMTP_USERNAME', getenv('SMTP_USERNAME') ?: '');
define('SMTP_PASSWORD', getenv('SMTP_PASSWORD') ?: '');
define('SMTP_PORT', (int) (getenv('SMTP_PORT') ?: 465));
define('SMTP_ENCRYPTION', getenv('SMTP_ENCRYPTION') ?: 'ssl');

define('SMTP_FROM_EMAIL', getenv('SMTP_FROM_EMAIL') ?: '');
define('SMTP_FROM_NAME', getenv('SMTP_FROM_NAME') ?: 'Centralize Vision');

define('SMTP_TO_INFO_EMAIL', getenv('SMTP_TO_INFO_EMAIL') ?: '');
define('SMTP_TO_SUPPORT_EMAIL', getenv('SMTP_TO_SUPPORT_EMAIL') ?: '');

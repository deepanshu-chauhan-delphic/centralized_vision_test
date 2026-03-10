<?php
function processSignData($postData, $prefix)
{
    $signs = [];
    $count = count($postData[$prefix . '_color'] ?? []);

    for ($i = 0; $i < $count; $i++) {
        $signs[] = [
            'color' => filter_var($postData[$prefix . '_color'][$i], FILTER_SANITIZE_STRING),
            'size' => filter_var($postData[$prefix . '_size'][$i], FILTER_SANITIZE_STRING),
            'quantity' => filter_var($postData[$prefix . '_quantity'][$i], FILTER_SANITIZE_NUMBER_INT),
            'price' => filter_var($postData[$prefix . '_price'][$i], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION)
        ];
    }

    return $signs;
}

function buildFormEmailHtml($formData)
{
    ob_start();
?>
    <!DOCTYPE html>
    <html>

    <head>
        <meta charset="UTF-8">
        <style>
            body {
                font-family: Arial, sans-serif;
                color: #333;
                line-height: 1.6;
            }

            h1,
            h2,
            h3 {
                color: #2c3e50;
            }

            .section {
                margin-bottom: 25px;
            }

            .sign-block {
                background-color: #f5f5f5;
                padding: 10px;
                border-radius: 5px;
                margin-bottom: 10px;
            }

            .logo {
                max-width: 200px;
                margin-top: 10px;
            }
        </style>
    </head>

    <body>
        <h1>New Order Submission</h1>

        <?php
        // Helper function to check if a sign type has valid data
        function hasValidSigns($signsArray)
        {
            foreach ($signsArray as $sign) {
                if (!empty($sign['color']) || !empty($sign['size']) || !empty($sign['quantity'])) {
                    return true;
                }
            }
            return false;
        }
        ?>

        <?php if (
            hasValidSigns($formData['virtual_guard']['aluminum_signs']) ||
            hasValidSigns($formData['virtual_guard']['window_decals']) ||
            hasValidSigns($formData['virtual_guard']['sticker_signs'])
        ): ?>
            <div class="section">
                <h2>Virtual Guard Signs</h2>

                <?php
                $types = [
                    'aluminum_signs' => 'Aluminum Signs',
                    'window_decals'  => 'Window Decals',
                    'sticker_signs'  => 'Sticker Signs',
                ];

                foreach ($types as $key => $label):
                    if (hasValidSigns($formData['virtual_guard'][$key])):
                        echo "<h3>{$label}</h3>";
                        foreach ($formData['virtual_guard'][$key] as $i => $sign):
                            if (!empty($sign['color']) || !empty($sign['size']) || !empty($sign['quantity'])): ?>
                                <div class="sign-block">
                                    <strong>Sign #<?= $i + 1 ?></strong><br>
                                    <?php if (!empty($sign['color'])): ?>
                                        Color: <?= htmlspecialchars($sign['color']) ?><br>
                                    <?php endif; ?>
                                    <?php if (!empty($sign['size'])): ?>
                                        Size: <?= htmlspecialchars($sign['size']) ?><br>
                                    <?php endif; ?>
                                    <?php if (!empty($sign['quantity'])): ?>
                                        Quantity: <?= htmlspecialchars($sign['quantity']) ?><br>
                                    <?php endif; ?>
                                    <?php if (!empty($sign['price'])): ?>
                                        Price: $<?= number_format($sign['price'], 2) ?><br>
                                    <?php endif; ?>
                                </div>
                <?php endif;
                        endforeach;
                    endif;
                endforeach;
                ?>
            </div>
        <?php else: ?>
            <div class="section">
                <h2>Virtual Guard Signs</h2>
                <p>No Virtual Guard signs were selected (section skipped)</p>
            </div>
        <?php endif; ?>

        <?php if (
            hasValidSigns($formData['virtual_greeter']['signs']) ||
            !empty($formData['virtual_greeter']['sign_text']) ||
            $formData['virtual_greeter']['logo_uploaded']
        ): ?>
            <div class="section">
                <h2>Virtual Greeter Service</h2>

                <?php if (hasValidSigns($formData['virtual_greeter']['signs'])): ?>
                    <h3>Greeter Signs</h3>
                    <?php foreach ($formData['virtual_greeter']['signs'] as $i => $sign):
                        if (!empty($sign['color']) || !empty($sign['size']) || !empty($sign['quantity'])): ?>
                            <div class="sign-block">
                                <strong>Sign #<?= $i + 1 ?></strong><br>
                                <?php if (!empty($sign['color'])): ?>
                                    Color: <?= htmlspecialchars($sign['color']) ?><br>
                                <?php endif; ?>
                                <?php if (!empty($sign['size'])): ?>
                                    Size: <?= htmlspecialchars($sign['size']) ?><br>
                                <?php endif; ?>
                                <?php if (!empty($sign['quantity'])): ?>
                                    Quantity: <?= htmlspecialchars($sign['quantity']) ?><br>
                                <?php endif; ?>
                                <?php if (!empty($sign['price'])): ?>
                                    Price: $<?= number_format($sign['price'], 2) ?><br>
                                <?php endif; ?>
                            </div>
                    <?php endif;
                    endforeach; ?>
                <?php endif; ?>

                <h3>Sign Text</h3>
                <p><?= !empty($formData['virtual_greeter']['sign_text']) ?
                        nl2br(htmlspecialchars($formData['virtual_greeter']['sign_text'])) :
                        'No sign text provided' ?></p>

                <h3>Logo</h3>
                <?php if (!empty($formData['virtual_greeter']['logo_url'])): ?>
                    <p><a href="<?= $formData['virtual_greeter']['logo_url'] ?>" target="_blank">View Uploaded Logo</a></p>
                <?php else: ?>
                    <p>No logo uploaded</p>
                <?php endif; ?>
            </div>
        <?php else: ?>
            <div class="section">
                <h2>Virtual Greeter Service</h2>
                <p>Virtual Greeter service was skipped</p>
            </div>
        <?php endif; ?>

        <div class="section">
            <h2>Shipping Information</h2>
            <p>
                <?php if (!empty($formData['shipping_info']['property_name'])): ?>
                    <strong>Property Name:</strong> <?= htmlspecialchars($formData['shipping_info']['property_name']) ?><br>
                <?php endif; ?>
                <strong>Contact:</strong> <?= htmlspecialchars($formData['shipping_info']['first_name']) ?> <?= htmlspecialchars($formData['shipping_info']['last_name']) ?><br>
                <strong>Address:</strong> <?= htmlspecialchars($formData['shipping_info']['shipping_address']) ?><br>
                <strong>City/State/Zip:</strong> <?= htmlspecialchars($formData['shipping_info']['city']) ?>,
                <?= htmlspecialchars($formData['shipping_info']['state']) ?> <?= htmlspecialchars($formData['shipping_info']['zip_code']) ?><br>
                <strong>Email:</strong> <?= htmlspecialchars($formData['shipping_info']['email']) ?><br>
                <strong>Phone:</strong> <?= htmlspecialchars($formData['shipping_info']['phone']) ?>
            </p>
        </div>
    </body>

    </html>
<?php
    return ob_get_clean();
}

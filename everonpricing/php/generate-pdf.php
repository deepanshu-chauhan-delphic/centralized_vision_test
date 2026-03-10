<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>New Order Submission</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            padding: 20px;
            background-color: #fff;
        }

        h1,
        h2,
        h3 {
            color: #2c3e50;
        }

        h1 {
            text-align: center;
        }

        .section {
            margin-bottom: 40px;
        }

        .table-title {
            margin: 15px 0 5px;
            font-size: 1.2em;
            font-weight: bold;
            color: #1a252f;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th,
        td {
            border: 1px solid #ccc;
            padding: 10px;
            text-align: left;
        }

        th {
            background-color: #f4f4f4;
        }

        .info-label {
            font-weight: bold;
        }

        .logo {
            max-width: 200px;
            margin-top: 10px;
        }

        .divider {
            border-top: 2px solid #ccc;
            margin: 30px 0;
        }

        @media print {
            @page {
                margin: 0;
            }

            body {
                margin: 0;
            }
        }
    </style>
</head>

<body>

    <h1>New Order Submission</h1>

    <!-- Virtual Guard Signs -->
    <div class="section">
        <h2>Virtual Guard Signs</h2>

        <div class="table-title">Aluminum Signs</div>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Color</th>
                    <th>Size</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                <?php
                if (!empty($formData['virtual_guard']['aluminum_signs'])):
                    foreach ($formData['virtual_guard']['aluminum_signs'] as $i => $sign): ?>
                        <tr>
                            <td><?= $i + 1; ?></td>
                            <td><?= htmlspecialchars($sign['color']) ?? '' ?></td>
                            <td><?= htmlspecialchars($sign['size']) ?> inches</td>
                            <td><?= htmlspecialchars($sign['quantity']) ?></td>
                            <td>$<?= number_format($sign['price'], 2) ?></td>
                        </tr>
                    <?php endforeach;
                else: ?>
                    <tr>
                        <td colspan="5" style="text-align: center;">No signs selected</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>

        <div class="table-title">Window Decals</div>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Color</th>
                    <th>Size</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                <?php
                if (!empty($formData['virtual_guard']['window_decals'])):
                    foreach ($formData['virtual_guard']['window_decals'] as $i => $sign): ?>
                        <tr>
                            <td><?= $i + 1; ?></td>
                            <td><?= htmlspecialchars($sign['color']) ?? '' ?></td>
                            <td><?= htmlspecialchars($sign['size']) ?> inches</td>
                            <td><?= htmlspecialchars($sign['quantity']) ?></td>
                            <td>$<?= number_format($sign['price'], 2) ?></td>
                        </tr>
                    <?php endforeach;
                else: ?>
                    <tr>
                        <td colspan="5" style="text-align: center;">No signs selected</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>

        <div class="table-title">Sticker Signs</div>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Color</th>
                    <th>Size</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                <?php
                if (!empty($formData['virtual_guard']['sticker_signs'])):
                    foreach ($formData['virtual_guard']['sticker_signs'] as $i => $sign): ?>
                        <tr>
                            <td><?= $i + 1; ?></td>
                            <td><?= htmlspecialchars($sign['color']) ?? '' ?></td>
                            <td><?= htmlspecialchars($sign['size']) ?> inches</td>
                            <td><?= htmlspecialchars($sign['quantity']) ?></td>
                            <td>$<?= number_format($sign['price'], 2) ?></td>
                        </tr>
                    <?php endforeach;
                else: ?>
                    <tr>
                        <td colspan="5" style="text-align: center;">No signs selected</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>

    <div class="divider"></div>

    <!-- Virtual Greeter Service -->
    <div class="section">
        <h2>Virtual Greeter Service</h2>

        <div class="table-title">Greeter Signs</div>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Color</th>
                    <th>Size</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                <?php
                if (!empty($formData['virtual_greeter']['signs'])):
                    foreach ($formData['virtual_greeter']['signs'] as $i => $sign): ?>
                        <tr>
                            <td><?= $i + 1; ?></td>
                            <td><?= htmlspecialchars($sign['color']) ?? '' ?></td>
                            <td><?= htmlspecialchars($sign['size']) ?> inches</td>
                            <td><?= htmlspecialchars($sign['quantity']) ?></td>
                            <td>$<?= number_format($sign['price'], 2) ?></td>
                        </tr>
                    <?php endforeach;
                else: ?>
                    <tr>
                        <td colspan="5" style="text-align: center;">No signs selected</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>

        <h3>Sign Text</h3>
        <p><?= nl2br(htmlspecialchars($formData['virtual_greeter']['sign_text'] ?? 'No Sign Text Found')) ?></p>

        <h3>Logo</h3>
        <?php if (!empty($formData['virtual_greeter']['logo_url'])): ?>
            <p>Logo URL: <?= htmlspecialchars($formData['virtual_greeter']['logo_url'] ?? 'none') ?></p>
        <?php else: ?>
            <p>No logo uploaded</p>
        <?php endif; ?>

    </div>

    <div class="divider"></div>

    <!-- Shipping Information -->
    <div class="section">
        <h2>Shipping Information</h2>
        <p><span class="info-label">Property Name:</span> <?= htmlspecialchars($formData['shipping_info']['property_name']) ?></p>
        <p><span class="info-label">Contact:</span> <?= htmlspecialchars($formData['shipping_info']['first_name']) . ' ' . htmlspecialchars($formData['shipping_info']['last_name']) ?></p>
        <p><span class="info-label">Address:</span> <?= htmlspecialchars($formData['shipping_info']['shipping_address']) ?></p>
        <p><span class="info-label">City/State/Zip:</span> <?= htmlspecialchars($formData['shipping_info']['city']) ?>,
            <?= htmlspecialchars($formData['shipping_info']['state']) ?>, <?= htmlspecialchars($formData['shipping_info']['zip_code']) ?></p>
        <p><span class="info-label">Email:</span> <?= htmlspecialchars($formData['shipping_info']['email']) ?></p>
        <p><span class="info-label">Phone:</span> <?= htmlspecialchars($formData['shipping_info']['phone']) ?></p>
    </div>

</body>

</html>
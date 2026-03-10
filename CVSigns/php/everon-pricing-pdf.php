<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Everon Price Matrix</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
            font-size: 12px;
        }

        .container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            box-sizing: border-box;
        }

        .pdf-header {
            text-align: center;
            margin-bottom: 20px;
        }

        .pdf-header img {
            max-width: 200px;
            height: auto;
        }

        h1,
        h2,
        h3 {
            color: #2c3e50;
            margin-top: 0;
        }

        h1 {
            font-size: 20px;
            margin-bottom: 10px;
            text-align: center;
        }

        h2 {
            font-size: 18px;
            text-align: center;
            margin-bottom: 20px;
        }

        h3 {
            font-size: 16px;
            margin-bottom: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            page-break-inside: avoid;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }

        #total-price {
            width: 100%;
            padding-right: 0px;
            padding-top: 8px;
            padding-bottom: 8px;
            padding-left: 10px;
            margin-bottom: 20px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }

        .form-table-info {
            margin-top: 20px;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 4px;
            font-size: 11px;
        }

        .form-table-info p {
            margin-bottom: 0;
        }

        .info-table {
            margin-bottom: 40px;
            margin-top: 40px;
            border-collapse: collapse;
            width: 100%;
        }

        @media print {
            @page {
                margin: 0;
            }

            body {
                margin: 0;
                font-size: 10pt;
            }

            .container {
                padding: 10px;
            }

            h1 {
                font-size: 16pt;
                text-align: center;
            }

            h2 {
                font-size: 14pt;
            }

            h3 {
                font-size: 12pt;
            }

            th,
            td {
                padding: 6px;
                font-size: 10pt;
            }

            .form-table-info {
                font-size: 9pt;
            }

            .no-print {
                display: none !important;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <header class="pdf-header">
            <h1 style="font-size: 30px; font-weight: bold;">
                Centralized Vision
            </h1>
        </header>

        <section>
            <h1>Everon Price Matrix</h1>
        </section>

        <section class="info-table">
            <div>
                <table>
                    <tr>
                        <td>Number of Cameras to be Monitored</td>
                        <td id="num-cameras-value"><?= $formData['numberCamerasMonitored'] ?? '0' ?></td>
                    </tr>
                    <tr>
                        <td>Number of Camera's with A.I.</td>
                        <td id="num-ai-cameras-value"><?= $formData['numberCamerasInAi'] ?? '0' ?></td>
                    </tr>
                    <tr>
                        <td>Holiday Monitoring Days</td>
                        <td id="holiday-days-value"><?= $formData['numberOfHolidays'] ?? '0' ?></td>
                    </tr>
                    <tr>
                        <td>Live Guard Dispatch?</td>
                        <td id="live-monitoring-value"><?= $formData['liveSecurityMonitoring'] == 1 ? 'Yes' : 'No' ?></td>
                    </tr>
                    <tr>
                        <th colspan="2">Monitoring Hours by Day</th>
                    </tr>
                    <tr>
                        <td>Monday</td>
                        <td id="mon-hours-value"><?= $formData['mondayHours'] ?? '0' ?></td>
                    </tr>
                    <tr>
                        <td>Tuesday</td>
                        <td id="tue-hours-value"><?= $formData['tuesdayHours'] ?? '0' ?></td>
                    </tr>
                    <tr>
                        <td>Wednesday</td>
                        <td id="wed-hours-value"><?= $formData['wednesdayHours'] ?? '0' ?></td>
                    </tr>
                    <tr>
                        <td>Thursday</td>
                        <td id="thu-hours-value"><?= $formData['thursdayHours'] ?? '0' ?></td>
                    </tr>
                    <tr>
                        <td>Friday</td>
                        <td id="fri-hours-value"><?= $formData['fridayHours'] ?? '0' ?></td>
                    </tr>
                    <tr>
                        <td>Saturday</td>
                        <td id="sat-hours-value"><?= $formData['saturdaydayHours'] ?? '0' ?></td>
                    </tr>
                    <tr>
                        <td>Sunday</td>
                        <td id="sun-hours-value"><?= $formData['sundayHours'] ?? '0' ?></td>
                    </tr>
                    <tr class="total-row">
                        <td><b>Total Weekly Hours</b></td>
                        <td id="total-hours-value"><b><?= $formData['totalHours'] ?? '0' ?></b></td>
                    </tr>
                </table>
            </div>
        </section>

        <section>
            <h2>Pricing Quote</h2>
            <div>
                <div>
                    <h3>Virtual Guard</h3>
                    <table>
                        <tr>
                            <th>Services</th>
                            <th>Wholesale</th>
                            <th>Everon Price to Customer</th>
                        </tr>
                        <tr>
                            <td>Security Camera Monitoring</td>
                            <td><?= htmlspecialchars($formData['securityCamMonitoringWholesale']) ?></td>
                            <td><?= htmlspecialchars($formData['securityCamMonitoringRetail']) ?></td>
                        </tr>
                        <tr>
                            <td>Holiday Camera Monitoring</td>
                            <td><?= htmlspecialchars($formData['holidayMonitoringWholesale']) ?></td>
                            <td><?= htmlspecialchars($formData['holidayMonitoringRetail']) ?></td>
                        </tr>
                        <tr>
                            <td>AI Camera Monitoring</td>
                            <td><?= htmlspecialchars($formData['aiMonitoringWholesale']) ?></td>
                            <td><?= htmlspecialchars($formData['aiMonitoringRetail']) ?></td>
                        </tr>
                    </table>
                </div>
                <div>
                    <h3>Live Guard</h3>
                    <table>
                        <tr>
                            <td>Live Guard Dispatch</td>
                            <td><?= htmlspecialchars($formData['liveGuardWholesale']) ?></td>
                            <td><?= htmlspecialchars($formData['liveGuardRetail']) ?></td>
                        </tr>
                    </table>
                </div>
                <div>
                    <h3>Total Cost</h3>
                    <table>
                        <tr>
                            <td>Total Monthly Price</td>
                            <td><?= htmlspecialchars($formData['totalWholesale']) ?></td>
                            <td><?= htmlspecialchars($formData['totalRetail']) ?></td>
                        </tr>
                    </table>
                </div>
                <div>
                    <table>
                        <tr>
                            <td>Time Plan</td>
                            <td> <?= htmlspecialchars($formData['timePlan'] . ' Years') ?></td>
                        </tr>
                    </table>
                </div>

                <div class="form-table-info">
                    <h3>One Time Start Up Fee of $220 is charged per site</h3>
                    <p>Note: We realize that not every opportunity fits perfectly within the pricing matrix as we have a
                        very customizable approach. For any opportunities that arise that don't work within its
                        framework please reach
                        out to your sales manager with those scenarios. Also note that we do offer price breaks for
                        opportunities that consist of multiple locations. Those price breaks can be established ahead of
                        time but will not be
                        reflected on billing until each facility is onboarded</p>
                </div>
            </div>
        </section>
    </div>
</body>

</html>
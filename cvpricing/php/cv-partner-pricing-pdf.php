<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV Partner Price Matrix</title>
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
            <h1>Proposal For : <?= $formData['companyName'] ?></h1>
        </section>

        <section class="info-table">
            <div>
                <div>
                    <h3>Virtual Guard</h3>
                    <table>
                        <tr>
                            <td>Virtual Guard-Live Security Monitoring?</td>
                            <td id="live-monitoring-value"><?= $formData['liveSecurityMonitoring'] == 1 ? 'Yes' : 'No' ?></td>
                        </tr>
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
                <div>
                    <h3>Virtual Guard Access Control</h3>
                    <table>
                        <tr>
                            <td>Access Control Monitoring?</td>
                            <td id="access-control-monitoring-value"><?= $formData['accessControlMonitor'] == 1 ? 'Yes' : 'No' ?></td>
                        </tr>
                        <tr>
                            <td>How many points to be monitored?</td>
                            <td id="access-control-points-value"><?= $formData['accessControlPoints'] ?? '0' ?></td>
                        </tr>
                        <tr>
                            <td>Access Control Database Management?</td>
                            <td id="access-control-db-value"><?= $formData['accessControlDbManage'] == 1 ? 'Yes' : 'No' ?></td>
                        </tr>
                    </table>
                </div>
                <div>
                    <h3>Virtual Greeter/Concierge</h3>
                    <table>
                        <tr>
                            <td>Virtual Greeter/Concierge?</td>
                            <td id="virtual-greeter-value"><?= $formData['virtualGreeter'] == 1 ? 'Yes' : 'No' ?></td>
                        </tr>
                        <tr>
                            <td>If Yes, will we act as the primary or secondary contact? </td>
                            <td id="greeter-contact-type-value"><?= ucfirst($formData['virtualGreeterType']) ?></td>
                        </tr>
                        <tr>
                            <td>Number of Residences Included:</td>
                            <td id="greeter-residences-value"><?= $formData['virtualGreeterNumResidences'] ?? '0' ?></td>
                        </tr>
                    </table>
                </div>
                <div>
                    <h3>Virtual Engineering</h3>
                    <table>
                        <tr>
                            <td>Virtual Engineer?</td>
                            <td id="virtual-engineer-value"><?= $formData['virtualEng'] == 1 ? 'Yes' : 'No' ?></td>
                        </tr>
                        <tr>
                            <td>Number of Systems Monitored</td>
                            <td id="engineer-systems-value"><?= $formData['virtualEngNumOfSystem'] ?? '0' ?></td>
                        </tr>
                    </table>
                </div>
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
                            <th>Retail</th>
                        </tr>
                        <tr>
                            <td>Security Camera Monitoring</td>
                            <td><?= htmlspecialchars($formData['securityCamMonitoringWholesale']) ?></td>
                            <td><?= htmlspecialchars($formData['securityCamMonitoringRetail']) ?></td>
                        </tr>
                        <tr>
                            <td>AI Camera Monitoring</td>
                            <td><?= htmlspecialchars($formData['aiMonitoringWholesale']) ?></td>
                            <td><?= htmlspecialchars($formData['aiMonitoringRetail']) ?></td>
                        </tr>
                        <tr>
                            <td>Holiday Camera Monitoring</td>
                            <td><?= htmlspecialchars($formData['holidayMonitoringWholesale']) ?></td>
                            <td><?= htmlspecialchars($formData['holidayMonitoringRetail']) ?></td>
                        </tr>
                        <tr>
                            <td><b>Total Monthly Price</b></td>
                            <td>
                                <div id="total-price-table-vlu"><?= htmlspecialchars($formData['totalMonthlyWholesale']) ?></div>
                            </td>
                            <td>
                                <div id="total-price-table-vlu-rt"><?= htmlspecialchars($formData['totalMonthlyRetail']) ?></div>
                            </td>
                        </tr>
                    </table>
                </div>
                <div>
                    <h3>Virtual Guard Access Control</h3>
                    <table>
                        <tr>
                            <td>Access Control Monitoring</td>
                            <td><?= htmlspecialchars($formData['accessControlWholesale']) ?></td>
                            <td><?= htmlspecialchars($formData['accessControlRetail']) ?></td>
                        </tr>
                        <tr>
                            <td>Database Management</td>
                            <td><?= htmlspecialchars($formData['dbManagementWholesale']) ?></td>
                            <td><?= htmlspecialchars($formData['dbManagementRetail']) ?></td>
                        </tr>
                        <tr>
                            <td>Camera Monitoring w/Access Control & DB Management Combo <sup class="question-icon"><i
                                        class="fa-solid fa-circle-question"></i></sup></td>
                            <td><?= htmlspecialchars($formData['totalAccessControlWholesale']) ?></td>
                            <td><?= htmlspecialchars($formData['totalAccessControlRetail']) ?></td>
                        </tr>
                    </table>
                </div>
                <div>
                    <h3>Virtual Greeter/Concierge</h3>
                    <table>
                        <tr>
                            <td>Virtual Greeter/Concierge Pricing</td>
                            <td><?= htmlspecialchars($formData['virtualGreeterWholesale']) ?></td>
                            <td><?= htmlspecialchars($formData['virtualGreeterRetail']) ?></td>
                        </tr>
                    </table>
                </div>
                <div>
                    <h3>Virtual Engineering</h3>
                    <table>
                        <tr>
                            <td><span id="vir-num-of-system"><?= $formData['virtualSyatemMonitored'] ?? '0' ?></span> Systems Monitored</td>
                            <td><?= htmlspecialchars($formData['virtualEngineeringWholesale']) ?></td>
                            <td><?= htmlspecialchars($formData['virtualEngineeringRetail']) ?></td>
                        </tr>
                    </table>
                </div>
                <div>
                    <h3>Total Cost for All Services</h3>
                    <table>
                        <tr>
                            <td>Total Monthly</td>
                            <td><?= htmlspecialchars($formData['totalWholesale']) ?></td>
                            <td><?= htmlspecialchars($formData['totalRetail']) ?></td>
                        </tr>
                        <tr>
                            <td>Total Annually</td>
                            <td><?= htmlspecialchars($formData['totalWholesaleAnnually']) ?></td>
                            <td><?= htmlspecialchars($formData['totalRetailAnnually']) ?></td>
                        </tr>
                    </table>
                </div>
                <div>
                    <table>
                        <tr>
                            <td>Contact Term</td>
                            <td>
                                <?php
                                $termLabels = [
                                    'mtm' => 'Month-to-Month',
                                    '6m' => '6 Months',
                                    '1yr' => '1 Year',
                                    '2yr' => '2 Years',
                                    '3yr' => '3 Years',
                                    // Backward-compatible values
                                    '1' => '1 Year',
                                    '2' => '6 Months',
                                    '3' => 'Month-to-Month',
                                    '4' => '6 Years',
                                ];
                                $termValue = $formData['contactTerm'] ?? '';
                                echo htmlspecialchars($termLabels[$termValue] ?? $termValue);
                                ?>
                            </td>
                        </tr>
                        <tr>
                            <td>Mark Up</td>
                            <td><?= htmlspecialchars($formData['markUp'] . ' %') ?></td>
                        </tr>
                    </table>
                </div>

                <div class="form-table-info">
                    <h3>One Time Setup Fee charged at rate of $110 hr</h3>
                    <p class="pt-2"><b>(Typical time required per Virtual Service is 2-3 hours)</b></p>
                    <p>Note: We realize that not every opportunity fits perfectly within the pricing matrix as we have a
                        very customizable approach. Please <a href="https://centralizedvision.com/contact-us/">contact
                            us</a> with any questions, ideas or challenges that may arise from your discovery with
                        client. Also note that we do offer price breaks for opportunities that consist of multiple
                        facilities. Those price breaks can be established ahead of time but will not be reflected on
                        billing until each facility is onboarded.</p>
                </div>
            </div>
        </section>
    </div>
</body>

</html>

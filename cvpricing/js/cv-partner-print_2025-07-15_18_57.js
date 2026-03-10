import { BASE_URL } from "./config.js";
async function openPrintScreen() {
    const formDataObj = gatherFormData(); // Get plain object
    const formData = new FormData(); // Create a new FormData

    // Append all fields to FormData
    for (const key in formDataObj) {
        formData.append(key, formDataObj[key]);
    }
    formData.append("action", "print");

    try {
        const response = await fetch(`${BASE_URL}php/generate-cv-pdf.php`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Get the response as text (HTML)
        const html = await response.text();

        // Open a new window with the HTML content
        const printWindow = window.open('', '_blank');
        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();

        // Wait for the content to load before printing
        printWindow.onload = function () {
            printWindow.print();
        };
    } catch (error) {
        console.error('Error:', error);
        showAlert("Error: " + error, "error");
    }
}

async function downloadPdf() {
    const formDataObj = gatherFormData(); // Get plain object
    const formData = new FormData();

    for (const key in formDataObj) {
        formData.append(key, formDataObj[key]);
    }
    formData.append("action", "pdf");

    try {
        const response = await fetch(`${BASE_URL}php/generate-cv-pdf.php`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Get the response as text (HTML)
        const data = await response.json();

        if (data.success && data.pdf_data) {
            // Convert base64 to blob and download
            const byteCharacters = atob(data.pdf_data);
            const byteNumbers = new Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "application/pdf" });

            // Create download link and trigger click
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "CV-Partner-Price-Matrix.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url); // Clean up memory
            showAlert("PDF generated successfully!", "success");
        } else {
            throw new Error('Failed to generate PDF');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert("Error: " + error, "error");
    }
}


function gatherFormData() {
    return {
        liveSecurityMonitoring: document.getElementById('lgdisp-boolean').value,
        numberCamerasMonitored: document.getElementById('number-of-cameras-new').value,
        numberCamerasInAi: document.getElementById('number-of-ai-cameras').value,
        numberOfHolidays: document.getElementById('number-of-holidays').value,
        mondayHours: document.getElementById('mon-new').value,
        tuesdayHours: document.getElementById('tue-new').value,
        wednesdayHours: document.getElementById('wed-new').value,
        thursdayHours: document.getElementById('thu-new').value,
        fridayHours: document.getElementById('fri-new').value,
        saturdaydayHours: document.getElementById('sat-new').value,
        sundayHours: document.getElementById('sun-new').value,
        totalHours: document.getElementById('days-result-new').textContent.trim(),

        accessControlMonitor: document.getElementById('accessControlMonitor').value,
        accessControlPoints: document.getElementById('accessControlPoints').value,
        accessControlDbManage: document.getElementById('accessControlDbManage').value,

        virtualGreeter: document.getElementById('virtualGreeter').value,
        virtualGreeterType: document.getElementById('virtualGreeterType').value,
        virtualGreeterNumResidences: document.getElementById('virtualGreeterNumResidences').value,

        virtualEng: document.getElementById('virtualEng').value,
        virtualEngNumOfSystem: document.getElementById('virtualEngNumOfSystem').value,

        securityCamMonitoringWholesale: document.getElementById('monthly-cost-wh-new').textContent.trim(),
        securityCamMonitoringRetail: document.getElementById('monthly-cost-rt-new').textContent.trim(),
        holidayMonitoringWholesale: document.getElementById('monthly-cost-holiday-wh').textContent.trim(),
        holidayMonitoringRetail: document.getElementById('monthly-cost-holiday-rt').textContent.trim(),
        aiMonitoringWholesale: document.getElementById('monthly-cost-ai-wh').textContent.trim(),
        aiMonitoringRetail: document.getElementById('monthly-cost-ai-rt').textContent.trim(),
        totalMonthlyWholesale: document.getElementById('total-price-table-vlu').textContent.trim(),
        totalMonthlyRetail: document.getElementById('total-price-table-vlu-rt').textContent.trim(),
        accessControlWholesale: document.getElementById('acc-con-wholesale').textContent.trim(),
        accessControlRetail: document.getElementById('acc-con-retail').textContent.trim(),
        dbManagementWholesale: document.getElementById('acc-con-db-manage-wholesale').textContent.trim(),
        dbManagementRetail: document.getElementById('acc-con-db-manage-retail').textContent.trim(),
        totalAccessControlWholesale: document.getElementById('acc-con-both-wholesale').textContent.trim(),
        totalAccessControlRetail: document.getElementById('acc-con-both-retail').textContent.trim(),
        virtualGreeterWholesale: document.getElementById('vir-greet-wholesale').textContent.trim(),
        virtualGreeterRetail: document.getElementById('vir-greet-retail').textContent.trim(),
        virtualEngineeringWholesale: document.getElementById('vir-eng-wholesale').textContent.trim(),
        virtualEngineeringRetail: document.getElementById('vir-eng-retail').textContent.trim(),
        virtualSyatemMonitored: document.getElementById('vir-num-of-system').textContent.trim(),
        totalWholesale: document.getElementById('total-mon-wholesale').textContent.trim(),
        totalRetail: document.getElementById('total-mon-retail').textContent.trim(),
        totalWholesaleAnnually: document.getElementById('total-anu-wholesale').textContent.trim(),
        totalRetailAnnually: document.getElementById('total-anu-retail').textContent.trim(),
        contactTerm: document.getElementById('time-plan').value,
        markUp: document.getElementById('markup').value,

        companyName: document.getElementById('company-name').value,
    };
}

function showAlert(message, type = "success") {
    Swal.fire({
        text: message,
        icon: type,
        timer: 5000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
    });
}

window.openPrintScreen = openPrintScreen;
window.downloadPdf = downloadPdf;
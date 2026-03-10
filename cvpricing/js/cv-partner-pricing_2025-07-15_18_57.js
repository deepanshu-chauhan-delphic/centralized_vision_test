import getFinalPrice from "./cv-partner/calculatePricing_2025-07-15_18_57.js";
import { getCvPartnerPricing, getCameraPricingForCvPartner } from "./cv-partner/helpers_2025-07-15_18_57.js";

const userRequirements = {
  numOfCam: 0,
  numOfAiCam: 0,
  holidayMonitoringDays: 0,
  virtualGuardSecurityMonitoring: 0,
  dailyHours: {
    mon: 0,
    tue: 0,
    wed: 0,
    thu: 0,
    fri: 0,
    sat: 0,
    sun: 0,
  },
  accessControl: {
    required: 0,
    numOfPoints: 0,
    accessControlDbManage: 0
  },
  virtualGreet: {
    required: 0,
    contactType: 'Secondary',
    numOfResidences: 0
  },
  virtualEng: {
    required: 0,
    numOfSystem: 0
  },
  contractTerm: 3,
  markup: 0
};

const pricingQuotes = {
  totalHours: 0,
  services: {
    securityCamMonitoring: {
      wholeSale: 0,
      priceToCustomer: 0,
    },
    holidayCamMonitoring: {
      wholeSale: 0,
      priceToCustomer: 0,
    },
    aiCamMonitoring: {
      wholeSale: 0,
      priceToCustomer: 0,
    },
  },
  accessControl: {
    monitor: {
      wholesale: 0,
      retail: 0
    },
    databaseManage: {
      wholesale: 0,
      retail: 0
    },
    both: {
      wholesale: 0,
      retail: 0
    }
  },
  virtualGreet: {
    wholesale: 0,
    retail: 0
  },
  virtualEng: {
    wholesale: 0,
    retail: 0
  },
  totalCost: {
    monthly: {
      wholeSale: 0,
      retail: 0
    },
    annually: {
      wholeSale: 0,
      retail: 0
    }
  }
};

let cvMatrixPricingData = {};
let cameraPricingData = {};
(async () => {
  cvMatrixPricingData = await getCvPartnerPricing();
  cameraPricingData = await getCameraPricingForCvPartner();
})();

function calculatePricing() {
  getFinalPrice(userRequirements, pricingQuotes, cvMatrixPricingData, cameraPricingData)
}

function updateUi() {
  $("#days-result-new").text(pricingQuotes.totalHours);
  $("#monthly-cost-wh-new").text(
    `$ ${pricingQuotes.services.securityCamMonitoring.wholeSale.toFixed(2)}`
  );
  $("#monthly-cost-rt-new").text(
    `$ ${pricingQuotes.services.securityCamMonitoring.priceToCustomer.toFixed(
      2
    )}`
  );

  $('#vir-num-of-system').text(userRequirements.virtualEng.numOfSystem);

  $("#monthly-cost-holiday-wh").text(
    `$ ${pricingQuotes.services.holidayCamMonitoring.wholeSale.toFixed(2)}`
  );

  $("#monthly-cost-holiday-rt").text(
    `$ ${pricingQuotes.services.holidayCamMonitoring.priceToCustomer.toFixed(
      2
    )}`
  );
             
  $("#monthly-cost-ai-wh").text(
    `$ ${pricingQuotes.services.aiCamMonitoring.wholeSale.toFixed(2)}`
  );
  $("#monthly-cost-ai-rt").text(
    `$ ${pricingQuotes.services.aiCamMonitoring.priceToCustomer.toFixed(2)}`
  );

  const totalVirtualGuradMonthly = pricingQuotes.services.aiCamMonitoring.wholeSale +
    pricingQuotes.services.holidayCamMonitoring.wholeSale +
    pricingQuotes.services.securityCamMonitoring.wholeSale;

  $('#total-price-table-vlu').text(
    `$ ${totalVirtualGuradMonthly.toFixed(2)}`
  );

  const totalVirtualGuradMonthlyRetail = pricingQuotes.services.aiCamMonitoring.priceToCustomer +
    pricingQuotes.services.holidayCamMonitoring.priceToCustomer +
    pricingQuotes.services.securityCamMonitoring.priceToCustomer;

  $('#total-price-table-vlu-rt').text(
    `$ ${totalVirtualGuradMonthlyRetail.toFixed(2)}`
  );

  $('#acc-con-wholesale').text(
    `$ ${pricingQuotes.accessControl.monitor.wholesale.toFixed(2)}`
  );

  $('#acc-con-retail').text(
    `$ ${pricingQuotes.accessControl.monitor.retail.toFixed(2)}`
  );

  $('#acc-con-db-manage-wholesale').text(
    `$ ${pricingQuotes.accessControl.databaseManage.wholesale.toFixed(2)}`
  );

  $('#acc-con-db-manage-retail').text(
    `$ ${pricingQuotes.accessControl.databaseManage.retail.toFixed(2)}`
  );

  $('#acc-con-both-wholesale').text(
    `$ (${pricingQuotes.accessControl.both.wholesale.toFixed(2)})`
  );

  $('#acc-con-both-retail').text(
    `$ (${pricingQuotes.accessControl.both.retail.toFixed(2)})`
  );

  if( pricingQuotes.accessControl.both.retail > 0 ) {
    $('#discount-both').text(`Discount: $50`);
  } else {
    $('#discount-both').text('');
  }

  $('#vir-greet-wholesale').text(
    `$ ${pricingQuotes.virtualGreet.wholesale.toFixed(2)}`
  );

  $('#vir-greet-retail').text(
    `$ ${pricingQuotes.virtualGreet.retail.toFixed(2)}`
  );

  $('#vir-eng-wholesale').text(
    `$ ${pricingQuotes.virtualEng.wholesale.toFixed(2)}`
  );

  $('#vir-eng-retail').text(
    `$ ${pricingQuotes.virtualEng.retail.toFixed(2)}`
  );

  $('#total-mon-wholesale').text(
    `$ ${pricingQuotes.totalCost.monthly.wholeSale.toFixed(2)}`
  );

  $('#total-mon-retail').text(
    `$ ${pricingQuotes.totalCost.monthly.retail.toFixed(2)}`
  );

  $('#total-anu-wholesale').text(
    `$ ${pricingQuotes.totalCost.annually.wholeSale.toFixed(2)}`
  );

  $('#total-anu-retail').text(
    `$ ${pricingQuotes.totalCost.annually.retail.toFixed(2)}`
  );
}

function initEventListners() {
  $(".input-day").on("input", function () {
    const value = parseInt(this.value) || 0;
    // Validate input
    if (value < 0 || value > 24) {
      alert('Invalid hour value', value);
      return;
    }
    const id = this.id.split("-")[0];
    userRequirements.dailyHours[id] = parseInt(value) || 0;
    const totalHours = Object.values(userRequirements.dailyHours).reduce(
      (sum, h) => sum + h,
      0
    );
    pricingQuotes.totalHours = totalHours;

    calculatePricing();
    updateUi();
  });

  $("#number-of-cameras-new").on("input", function () {
    userRequirements.numOfCam = parseInt($(this).val()) || 0;
    calculatePricing();
    updateUi();
  });

  $("#number-of-ai-cameras").on("input", function () {
    userRequirements.numOfAiCam = parseInt($(this).val()) || 0;
    calculatePricing();
    updateUi();
  });

  $("#number-of-holidays").on("input", function () {
    userRequirements.holidayMonitoringDays = parseInt($(this).val()) || 0;
    calculatePricing();
    updateUi();
  });

  $("#lgdisp-boolean").on("change", function () {
    userRequirements.virtualGuardSecurityMonitoring = parseInt($(this).val()) || 0;
    calculatePricing();
    updateUi();
  });

  $("#time-plan").on("change", function () {
    userRequirements.contractTerm = parseInt($(this).val());
    calculatePricing();
    updateUi();
  });

  $("#accessControlMonitor").on("change", function () {
    userRequirements.accessControl.required = parseInt($(this).val());
    calculatePricing();
    updateUi();
  });

  $("#accessControlPoints").on("input", function () {
    userRequirements.accessControl.numOfPoints = parseInt($(this).val()) || 0;
    calculatePricing();
    updateUi();
  });

  $("#accessControlDbManage").on("input", function () {
    userRequirements.accessControl.accessControlDbManage = parseInt($(this).val());
    calculatePricing();
    updateUi();
  });

  $("#virtualGreeter").on("change", function () {
    userRequirements.virtualGreet.required = parseInt($(this).val());
    calculatePricing();
    updateUi();
  });

  $("#virtualGreeterType").on("change", function () {
    userRequirements.virtualGreet.contactType = $(this).val();
    calculatePricing();
    updateUi();
  });

  $("#virtualGreeterNumResidences").on("input", function () {
    userRequirements.virtualGreet.numOfResidences = parseInt($(this).val());
    calculatePricing();
    updateUi();
  });

  $("#virtualEng").on("input", function () {
    userRequirements.virtualEng.required = parseInt($(this).val());
    calculatePricing();
    updateUi();
  });

  $("#virtualEngNumOfSystem").on("input", function () {
    userRequirements.virtualEng.numOfSystem = parseInt($(this).val());
    calculatePricing();
    updateUi();
  });

  $("#markup").on("change", function() {
    userRequirements.markup = parseInt($(this).val()) || 0;
    calculatePricing();
    updateUi();
  })
}

window.addEventListener("load", () => {
  initEventListners();
});

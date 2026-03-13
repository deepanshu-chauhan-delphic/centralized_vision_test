import getFinalPrice from "./cv-partner/calculatePricing.js";
import { getCvPartnerPricing, getCameraPricingForCvPartner } from "./cv-partner/helpers.js";

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
  contractTerm: "mtm",
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

const MSU_CLASSIFICATION_LABELS = {
  "0-12": "AVG DAILY HOURS 0-12",
  "13-18": "AVG DAILY HOURS 13-18",
  "19-24": "AVG DAILY HOURS 19-24",
};

const MSU_PRICING = {
  1: {
    1: {
      "0-12": [0.6, 1.05, 1.4, 1.5, 1.5, 1.5, 1.6, 1.6, 1.6, 1.6, 1.7, 1.7, 1.7, 1.7, 1.7],
      "13-18": [0.55, 0.95, 1.3, 1.4, 1.4, 1.4, 1.5, 1.5, 1.5, 1.5, 1.6, 1.6, 1.6, 1.6, 1.6],
      "19-24": [0.45, 0.85, 1.2, 1.3, 1.3, 1.3, 1.4, 1.4, 1.4, 1.4, 1.5, 1.5, 1.5, 1.5, 1.5],
    },
    2: {
      "0-12": [0.7, 1.25, 1.5, 1.6, 1.6, 1.6, 1.7, 1.7, 1.7, 1.7, 1.8, 1.8, 1.8, 1.8, 1.8],
      "13-18": [0.65, 1.15, 1.4, 1.5, 1.5, 1.5, 1.6, 1.6, 1.6, 1.6, 1.7, 1.7, 1.7, 1.7, 1.7],
      "19-24": [0.55, 1.05, 1.3, 1.4, 1.4, 1.4, 1.5, 1.5, 1.5, 1.5, 1.6, 1.6, 1.6, 1.6, 1.6],
    },
    3: {
      "0-12": [0.9, 1.7, 1.7, 1.8, 1.8, 1.8, 1.9, 1.9, 1.9, 1.9, 2, 2, 2, 2, 2],
      "13-18": [0.85, 1.6, 1.6, 1.7, 1.7, 1.7, 1.8, 1.8, 1.8, 1.8, 1.9, 1.9, 1.9, 1.9, 1.9],
      "19-24": [0.8, 1.5, 1.5, 1.6, 1.6, 1.6, 1.7, 1.7, 1.7, 1.7, 1.8, 1.8, 1.8, 1.8, 1.8],
    },
  },
  0: {
    1: {
      "0-12": [0.65, 1.25, 1.6, 1.7, 1.7, 1.7, 1.8, 1.8, 1.8, 1.8, 1.9, 1.9, 1.9, 1.9, 1.9],
      "13-18": [0.6, 1.15, 1.5, 1.6, 1.6, 1.6, 1.7, 1.7, 1.7, 1.7, 1.8, 1.8, 1.8, 1.8, 1.8],
      "19-24": [0.55, 1.05, 1.4, 1.5, 1.5, 1.5, 1.6, 1.6, 1.6, 1.6, 1.7, 1.7, 1.7, 1.7, 1.7],
    },
    2: {
      "0-12": [0.75, 1.35, 1.7, 1.8, 1.8, 1.8, 1.9, 1.9, 1.9, 1.9, 2, 2, 2, 2, 2],
      "13-18": [0.7, 1.25, 1.6, 1.7, 1.7, 1.7, 1.8, 1.8, 1.8, 1.8, 1.9, 1.9, 1.9, 1.9, 1.9],
      "19-24": [0.6, 1.15, 1.5, 1.6, 1.6, 1.6, 1.7, 1.7, 1.7, 1.7, 1.8, 1.8, 1.8, 1.8, 1.8],
    },
    3: {
      "0-12": [1, 1.9, 1.9, 2, 2, 2, 2.1, 2.1, 2.1, 2.1, 2.2, 2.2, 2.2, 2.2, 2.2],
      "13-18": [0.95, 1.8, 1.8, 1.9, 1.9, 1.9, 2, 2, 2, 2, 2.1, 2.1, 2.1, 2.1, 2.1],
      "19-24": [0.9, 1.7, 1.7, 1.8, 1.8, 1.8, 1.9, 1.9, 1.9, 1.9, 2, 2, 2, 2, 2],
    },
  },
};

const msuPanelState = {
  totalHours: 0,
  avgDailyHours: 0,
  classificationKey: "0-12",
  pricePerHour: 0,
  monthlyWholesaleRate: 0,
  totalRetailPrice: 0,
  quoteWholesaleRate: 0,
  quoteRetailPrice: 0,
};

let cvMatrixPricingData = {};
let cameraPricingData = {};
const pricingDataReady = (async () => {
  cvMatrixPricingData = await getCvPartnerPricing();
  cameraPricingData = await getCameraPricingForCvPartner();
})();

function calculatePricing() {
  getFinalPrice(userRequirements, pricingQuotes, cvMatrixPricingData, cameraPricingData)
}

function isMsuMode() {
  return $("#system-type").val() === "0";
}

function isInMsuSection(element) {
  return $(element).closest("#msu-section").length > 0;
}

function getCctvDayInputs() {
  return $(".input-day").filter((_, el) => !isInMsuSection(el));
}

function getMsuDayInputs() {
  return $("#msu-section .input-day");
}

function getCctvSelectById(id) {
  return $(id).filter((_, el) => !isInMsuSection(el)).last();
}

function getSafeIntValue(selectorOrElement, defaultValue = 0) {
  const rawValue = $(selectorOrElement).val();
  const parsed = parseInt(rawValue, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
}

function getSafeStringValue(selectorOrElement, defaultValue = "") {
  const rawValue = $(selectorOrElement).val();
  if (typeof rawValue !== "string") {
    return defaultValue;
  }
  const trimmed = rawValue.trim();
  return trimmed.length ? trimmed : defaultValue;
}

function normalizeContractTerm(value) {
  const allowedTerms = new Set(["mtm", "6m", "1yr", "2yr", "3yr"]);
  return allowedTerms.has(value) ? value : "mtm";
}

function hasPricingData() {
  return Boolean(cvMatrixPricingData?.virtualGreeter && cameraPricingData?.pricing);
}

function getMsuHourClassification(avgDailyHours) {
  if (avgDailyHours <= 12) {
    return "0-12";
  }
  if (avgDailyHours <= 18) {
    return "13-18";
  }
  return "19-24";
}

function getMsuPricePerHour(inspectionType, term, unitCount, classificationKey) {
  const bucket = MSU_PRICING[inspectionType]?.[term]?.[classificationKey];
  if (!bucket || unitCount < 1 || unitCount > bucket.length) {
    return 0;
  }
  return bucket[unitCount - 1];
}

function resetOptionalServicesForMsu() {
  userRequirements.accessControl.required = 0;
  userRequirements.accessControl.numOfPoints = 0;
  userRequirements.accessControl.accessControlDbManage = 0;
  userRequirements.virtualGreet.required = 0;
  userRequirements.virtualGreet.numOfResidences = 0;
  userRequirements.virtualEng.required = 0;
  userRequirements.virtualEng.numOfSystem = 0;
}

function calculateMsuPricing() {
  const inspectionType = getSafeIntValue("#msu-inspection-type", 1);
  const term = getSafeIntValue("#msu-time-plan", 2);
  const unitCount = getSafeIntValue("#msu-number-of-units", 1);
  const numOfAiCam = getSafeIntValue("#number-of-ai-cameras", 0);
  const holidayMonitoringDays = getSafeIntValue("#number-of-holidays", 0);

  const totalHours = getMsuDayInputs().toArray().reduce((sum, input) => {
    let value = getSafeIntValue(input, 0);
    if (value < 0) value = 0;
    if (value > 24) value = 24;
    return sum + value;
  }, 0);

  const avgDailyHours = Math.floor(totalHours / 7);
  const classificationKey = getMsuHourClassification(avgDailyHours);
  const pricePerHour = totalHours > 0
    ? getMsuPricePerHour(inspectionType, term, unitCount, classificationKey)
    : 0;
  const msuMonthlyWholesaleRate = (pricePerHour * totalHours * 52) / 12;
  const msuTotalRetailPrice = msuMonthlyWholesaleRate + (msuMonthlyWholesaleRate * 0.01 * userRequirements.markup);
  const aiWholesale = numOfAiCam > 0 ? numOfAiCam * 5 : 0;
  const holidayWholesale = holidayMonitoringDays > 0 ? (45 * holidayMonitoringDays) / 12 : 0;

  msuPanelState.totalHours = totalHours;
  msuPanelState.avgDailyHours = avgDailyHours;
  msuPanelState.classificationKey = classificationKey;
  msuPanelState.pricePerHour = pricePerHour;
  msuPanelState.monthlyWholesaleRate = msuMonthlyWholesaleRate;
  msuPanelState.totalRetailPrice = msuTotalRetailPrice;
  msuPanelState.quoteWholesaleRate = msuMonthlyWholesaleRate;
  msuPanelState.quoteRetailPrice = msuTotalRetailPrice;

  resetOptionalServicesForMsu();
  userRequirements.numOfAiCam = numOfAiCam;
  userRequirements.holidayMonitoringDays = holidayMonitoringDays;
  pricingQuotes.totalHours = totalHours;
  pricingQuotes.services.securityCamMonitoring.wholeSale = 0;
  pricingQuotes.services.securityCamMonitoring.priceToCustomer = 0;
  pricingQuotes.services.aiCamMonitoring.wholeSale = aiWholesale;
  pricingQuotes.services.aiCamMonitoring.priceToCustomer = aiWholesale;
  pricingQuotes.services.holidayCamMonitoring.wholeSale = holidayWholesale;
  pricingQuotes.services.holidayCamMonitoring.priceToCustomer = holidayWholesale;

  pricingQuotes.accessControl.monitor.wholesale = 0;
  pricingQuotes.accessControl.monitor.retail = 0;
  pricingQuotes.accessControl.databaseManage.wholesale = 0;
  pricingQuotes.accessControl.databaseManage.retail = 0;
  pricingQuotes.accessControl.both.wholesale = 0;
  pricingQuotes.accessControl.both.retail = 0;
  pricingQuotes.virtualGreet.wholesale = 0;
  pricingQuotes.virtualGreet.retail = 0;
  pricingQuotes.virtualEng.wholesale = 0;
  pricingQuotes.virtualEng.retail = 0;

  pricingQuotes.totalCost.monthly.wholeSale = (
    msuMonthlyWholesaleRate +
    aiWholesale +
    holidayWholesale
  );
  pricingQuotes.totalCost.monthly.retail = (
    msuTotalRetailPrice +
    aiWholesale +
    holidayWholesale
  );
  pricingQuotes.totalCost.annually.wholeSale = pricingQuotes.totalCost.monthly.wholeSale * 12;
  pricingQuotes.totalCost.annually.retail = pricingQuotes.totalCost.monthly.retail * 12;
}

function calculateAndUpdateUi() {
  if (isMsuMode()) {
    calculateMsuPricing();
    updateUi();
    return;
  }

  if (!hasPricingData()) {
    return;
  }

  syncStateFromInputs();
  calculatePricing();
  updateUi();
}

function syncStateFromInputs() {
  userRequirements.markup = getSafeIntValue("#markup", 0);

  if (isMsuMode()) {
    return;
  }

  userRequirements.numOfCam = getSafeIntValue("#number-of-cameras-new", 0);
  userRequirements.numOfAiCam = getSafeIntValue("#number-of-ai-cameras", 0);
  userRequirements.holidayMonitoringDays = getSafeIntValue("#number-of-holidays", 0);
  userRequirements.virtualGuardSecurityMonitoring = getSafeIntValue(getCctvSelectById("#lgdisp-boolean"), 0);
  userRequirements.contractTerm = normalizeContractTerm(
    getSafeStringValue(getCctvSelectById("#time-plan"), userRequirements.contractTerm)
  );
  userRequirements.accessControl.required = getSafeIntValue("#accessControlMonitor", 0);
  userRequirements.accessControl.numOfPoints = getSafeIntValue("#accessControlPoints", 0);
  userRequirements.accessControl.accessControlDbManage = getSafeIntValue("#accessControlDbManage", 0);
  userRequirements.virtualGreet.required = getSafeIntValue("#virtualGreeter", 0);
  userRequirements.virtualGreet.contactType = $("#virtualGreeterType").val() || userRequirements.virtualGreet.contactType;
  userRequirements.virtualGreet.numOfResidences = getSafeIntValue("#virtualGreeterNumResidences", 0);
  userRequirements.virtualEng.required = getSafeIntValue("#virtualEng", 0);
  userRequirements.virtualEng.numOfSystem = getSafeIntValue("#virtualEngNumOfSystem", 0);

  const totalHours = getCctvDayInputs().toArray().reduce((sum, input) => {
    const value = getSafeIntValue(input, 0);
    const id = input.id.split("-")[0];
    userRequirements.dailyHours[id] = value;
    return sum + value;
  }, 0);

  pricingQuotes.totalHours = totalHours;
}

function updateUi() {
  $("#msu-total-hours").text(msuPanelState.totalHours);
  $("#msu-average-hours").text(msuPanelState.avgDailyHours);
  $("#msu-pricing-classification").val(MSU_CLASSIFICATION_LABELS[msuPanelState.classificationKey]);
  $("#msu-price-per-hour").val(`$${msuPanelState.pricePerHour.toFixed(2)}`);
  $("#msu-monthly-wholesale-rate").val(`$${msuPanelState.monthlyWholesaleRate.toFixed(2)}`);
  $("#msu-total-retail-price").val(`$${msuPanelState.totalRetailPrice.toFixed(2)}`);
  $("#msu-quote-wholesale").text(`$ ${msuPanelState.quoteWholesaleRate.toFixed(2)}`);
  $("#msu-quote-retail").text(`$ ${msuPanelState.quoteRetailPrice.toFixed(2)}`);

  if (isMsuMode()) {
    $("#msu-pricing-quote-table").show();
  } else {
    $("#msu-pricing-quote-table").hide();
  }

  const dayResult = $("#days-result-new").filter((_, el) => !isInMsuSection(el)).first();
  if (dayResult.length) {
    dayResult.text(pricingQuotes.totalHours);
  }

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
  $("#system-type").on("change", function () {
    calculateAndUpdateUi();
  });

  getCctvDayInputs().on("input", function () {
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

    calculateAndUpdateUi();
  });

  $("#number-of-cameras-new").on("input", function () {
    userRequirements.numOfCam = parseInt($(this).val()) || 0;
    calculateAndUpdateUi();
  });

  $("#number-of-ai-cameras").on("input", function () {
    userRequirements.numOfAiCam = parseInt($(this).val()) || 0;
    calculateAndUpdateUi();
  });

  $("#number-of-holidays").on("input", function () {
    userRequirements.holidayMonitoringDays = parseInt($(this).val()) || 0;
    calculateAndUpdateUi();
  });

  getMsuDayInputs().on("input", function () {
    let value = parseInt(this.value, 10) || 0;
    if (value < 0) value = 0;
    if (value > 24) value = 24;
    this.value = value;
    calculateAndUpdateUi();
  });

  $("#msu-inspection-type").on("change", function () {
    calculateAndUpdateUi();
  });

  $("#msu-number-of-units").on("change", function () {
    calculateAndUpdateUi();
  });

  $("#msu-time-plan").on("change", function () {
    calculateAndUpdateUi();
  });

  getCctvSelectById("#lgdisp-boolean").on("change", function () {
    userRequirements.virtualGuardSecurityMonitoring = parseInt($(this).val()) || 0;
    calculateAndUpdateUi();
  });

  getCctvSelectById("#time-plan").on("change", function () {
    userRequirements.contractTerm = normalizeContractTerm($(this).val());
    calculateAndUpdateUi();
  });

  $("#accessControlMonitor").on("change", function () {
    userRequirements.accessControl.required = parseInt($(this).val());
    calculateAndUpdateUi();
  });

  $("#accessControlPoints").on("input", function () {
    userRequirements.accessControl.numOfPoints = parseInt($(this).val()) || 0;
    calculateAndUpdateUi();
  });

  $("#accessControlDbManage").on("change", function () {
    userRequirements.accessControl.accessControlDbManage = parseInt($(this).val());
    calculateAndUpdateUi();
  });

  $("#virtualGreeter").on("change", function () {
    userRequirements.virtualGreet.required = parseInt($(this).val());
    calculateAndUpdateUi();
  });

  $("#virtualGreeterType").on("change", function () {
    userRequirements.virtualGreet.contactType = $(this).val();
    calculateAndUpdateUi();
  });

  $("#virtualGreeterNumResidences").on("input", function () {
    userRequirements.virtualGreet.numOfResidences = parseInt($(this).val()) || 0;
    calculateAndUpdateUi();
  });

  $("#virtualEng").on("change", function () {
    userRequirements.virtualEng.required = parseInt($(this).val());
    calculateAndUpdateUi();
  });

  $("#virtualEngNumOfSystem").on("input", function () {
    userRequirements.virtualEng.numOfSystem = parseInt($(this).val()) || 0;
    calculateAndUpdateUi();
  });

  $("#markup").on("change", function() {
    userRequirements.markup = parseInt($(this).val()) || 0;
    calculateAndUpdateUi();
  })
}

window.addEventListener("load", async () => {
  initEventListners();
  await pricingDataReady;
  syncStateFromInputs();
  calculateAndUpdateUi();
});

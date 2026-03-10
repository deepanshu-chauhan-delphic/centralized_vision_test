const userRequirements = {
  numOfCam: 0,
  numOfAiCam: 0,
  holidayMonitoringDays: 0,
  liveGuardDispatchRequired: 0,
  dailyHours: {
    mon: 0,
    tue: 0,
    wed: 0,
    thu: 0,
    fri: 0,
    sat: 0,
    sun: 0,
  },
  planTerm: 5,
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
  virtualGuard: {
    accessControlMonitor: {
      wholeSale: 0,
      priceToCustomer: 0
    },
    databaseManagement: {
      wholeSale: 0,
      priceToCustomer: 0
    }
  },
  virtualGreet: {
    wholeSale: 0,
    priceToCustomer: 0
  },
  virtualEng: {
    wholeSale: 0,
    priceToCustomer: 0
  },
  liveGuard: {
    wholeSale: 0,
    priceToCustomer: 0,
  },
  totalCost: {
    wholeSale: 0,
    priceToCustomer: 0,
  },
};

let cameraPricing = {};
fetch("./data/camera-pricing.json")
  .then((res) => res.json())
  .then((res) => {
    cameraPricing = res;
  });

function getVirtualGuardCameraPricing(agreementYears, numCameras, exactHours) {
  // Validate inputs
  if (![3, 4, 5].includes(agreementYears)) {
	console.log("agreementYears error", agreementYears)
    return 0;
  }

  if (!Number.isInteger(numCameras) || numCameras < 1 || numCameras > 100) {
	console.log("numCameras error", numCameras)
    return 0;
  }

  if (!Number.isInteger(exactHours) || exactHours < 1 || exactHours > 24) {
	console.log("numCameras error", exactHours)
    return 0;
  }

  // Determine the hour range key based on exact hours
  let hourRange;
  if (exactHours <= 4) {
    hourRange = "1-4";
  } else if (exactHours <= 8) {
    hourRange = "5-8";
  } else if (exactHours <= 12) {
    hourRange = "9-12";
  } else if (exactHours <= 16) {
    hourRange = "13-16";
  } else {
    hourRange = "17-24";
  }

  // Determine the camera range key
  let cameraKey;
  if (numCameras <= 3) {
    cameraKey = "1-3";
  } else if (numCameras <= 6) {
    cameraKey = "4-6";
  } else if (numCameras <= 10) {
    cameraKey = "7-10";
  } else if (numCameras <= 15) {
    cameraKey = "11-15";
  } else if (numCameras <= 20) {
    cameraKey = "16-20";
  } else if (numCameras <= 25) {
    cameraKey = "21-25";
  } else if (numCameras <= 35) {
    cameraKey = "26-35";
  } else if (numCameras <= 45) {
    cameraKey = "36-45";
  } else if (numCameras <= 55) {
    cameraKey = "46-55";
  } else if (numCameras <= 75) {
    cameraKey = "56-75";
  } else {
    cameraKey = "76-100";
  }

  // Get the price
  const planKey = `${agreementYears}yr`;
  const price = cameraPricing.pricing[planKey][hourRange][cameraKey];

  if (price === undefined) {
    throw new Error("Could not find pricing for the specified parameters.");
  }

  return price;
}

function calculatePricing() {
  const holidayMonitorCost = 35;
  const liveGuardCost = 49;
  const totalHours = pricingQuotes.totalHours;
  const avgHours = Math.floor(totalHours / 7);

  const cameraCost = getVirtualGuardCameraPricing(
    userRequirements.planTerm,
    userRequirements.numOfCam,
    avgHours
  );

  const services = pricingQuotes.services;

  // secutiry cam monitor price
  if (userRequirements.numOfCam > 0) {
    services.securityCamMonitoring.wholeSale =
      (cameraCost * totalHours * 52) / 12;
  } else {
    services.securityCamMonitoring.wholeSale = 0;
  }
  services.securityCamMonitoring.priceToCustomer =
    services.securityCamMonitoring.wholeSale * 2;

  if (userRequirements.numOfAiCam) {
    // ai camera monitor price
    services.aiCamMonitoring.wholeSale = userRequirements.numOfAiCam * 8;
  } else {
    services.aiCamMonitoring.wholeSale = 0;
  }

  services.aiCamMonitoring.priceToCustomer = userRequirements.numOfAiCam * 12;

  if (userRequirements.holidayMonitoringDays > 0) {
    // holiday cam monitor price
    services.holidayCamMonitoring.wholeSale =
      (holidayMonitorCost * userRequirements.holidayMonitoringDays) / 12;
  } else {
    services.holidayCamMonitoring.wholeSale = 0;
  }

  services.holidayCamMonitoring.priceToCustomer = (50 *  userRequirements.holidayMonitoringDays) / 12

  // live guard cost
  if (userRequirements.liveGuardDispatchRequired == 1) {
    pricingQuotes.liveGuard.wholeSale = liveGuardCost;
    pricingQuotes.liveGuard.priceToCustomer = pricingQuotes.liveGuard.wholeSale * 2 + 1;
  } else {
    pricingQuotes.liveGuard.wholeSale = 0;
    pricingQuotes.liveGuard.priceToCustomer = 0;
  }

  // calculate total
  pricingQuotes.totalCost.wholeSale =
    pricingQuotes.services.aiCamMonitoring.wholeSale +
    pricingQuotes.services.holidayCamMonitoring.wholeSale +
    pricingQuotes.services.securityCamMonitoring.wholeSale +
    pricingQuotes.liveGuard.wholeSale;

  pricingQuotes.totalCost.priceToCustomer =
    pricingQuotes.services.aiCamMonitoring.priceToCustomer +
    pricingQuotes.services.holidayCamMonitoring.priceToCustomer +
    pricingQuotes.services.securityCamMonitoring.priceToCustomer +
    pricingQuotes.liveGuard.priceToCustomer;
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

  $("#lg-total-wh").text(`$ ${pricingQuotes.liveGuard.wholeSale.toFixed(2)}`);
  $("#lg-total-rt").text(
    `$ ${pricingQuotes.liveGuard.priceToCustomer.toFixed(2)}`
  );

  $("#total-price-wh-new").text(
    `$ ${pricingQuotes.totalCost.wholeSale.toFixed(2)}`
  );
  $("#total-price-rt-new").text(
    `$ ${pricingQuotes.totalCost.priceToCustomer.toFixed(2)}`
  );
}

function initEventListners() {
  
  $('#mon-new').on("input", function(e) {
    const value = parseInt(this.value) || 0;
    const id = "mon";
      
      // Validate input
      if (value < 0 || value > 24) {
        alert('Invalid hour value', value);
        return;
      }
      
      userRequirements.dailyHours[id] = value;
      
      // Calculate total hours
      const totalHours = Object.values(userRequirements.dailyHours).reduce(
        (sum, h) => sum + h,
        0
      );

      pricingQuotes.totalHours = totalHours;
      
      calculatePricing();
      updateUi();
  });

   $('#tue-new').on("input", function(e) {
    const value = parseInt(this.value) || 0;
    const id = "tue";
      
      // Validate input
      if (value < 0 || value > 24) {
        console.warn('Invalid hour value:', value);
        return;
      }
      
      userRequirements.dailyHours[id] = value;
      
      // Calculate total hours
      const totalHours = Object.values(userRequirements.dailyHours).reduce(
        (sum, h) => sum + h,
        0
      );

      pricingQuotes.totalHours = totalHours;
      
      calculatePricing();
      updateUi();
  });

   $('#wed-new').on("input", function(e) {
    const value = parseInt(this.value) || 0;
    const id = "wed";
      
      // Validate input
      if (value < 0 || value > 24) {
        console.warn('Invalid hour value:', value);
        return;
      }
      
      userRequirements.dailyHours[id] = value;
      
      // Calculate total hours
      const totalHours = Object.values(userRequirements.dailyHours).reduce(
        (sum, h) => sum + h,
        0
      );

      pricingQuotes.totalHours = totalHours;
      
      calculatePricing();
      updateUi();
  });

   $('#thu-new').on("input", function(e) {
    const value = parseInt(this.value) || 0;
    const id = "thu";
      
      // Validate input
      if (value < 0 || value > 24) {
        console.warn('Invalid hour value:', value);
        return;
      }
      
      userRequirements.dailyHours[id] = value;
      
      // Calculate total hours
      const totalHours = Object.values(userRequirements.dailyHours).reduce(
        (sum, h) => sum + h,
        0
      );

      pricingQuotes.totalHours = totalHours;
      
      calculatePricing();
      updateUi();
  });
  
  $('#fri-new').on("input", function(e) {
    const value = parseInt(this.value) || 0;
    const id = "fri";
      
      // Validate input
      if (value < 0 || value > 24) {
        console.warn('Invalid hour value:', value);
        return;
      }
      
      userRequirements.dailyHours[id] = value;
      
      // Calculate total hours
      const totalHours = Object.values(userRequirements.dailyHours).reduce(
        (sum, h) => sum + h,
        0
      );

      pricingQuotes.totalHours = totalHours;
      
      calculatePricing();
      updateUi();
  });

  $('#sat-new').on("input", function(e) {
    const value = parseInt(this.value) || 0;
    const id = "sat";
      
      // Validate input
      if (value < 0 || value > 24) {
        console.warn('Invalid hour value:', value);
        return;
      }
      
      userRequirements.dailyHours[id] = value;
      
      // Calculate total hours
      const totalHours = Object.values(userRequirements.dailyHours).reduce(
        (sum, h) => sum + h,
        0
      );

      pricingQuotes.totalHours = totalHours;
      
      calculatePricing();
      updateUi();
  });

  $('#sun-new').on("input", function(e) {
    const value = parseInt(this.value) || 0;
    const id = "sun";
      
      // Validate input
      if (value < 0 || value > 24) {
        console.warn('Invalid hour value:', value);
        return;
      }
      
      userRequirements.dailyHours[id] = value;
      
      // Calculate total hours
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
    userRequirements.liveGuardDispatchRequired = parseInt($(this).val()) || 0;
    calculatePricing();
    updateUi();
  });

  $("#time-plan-new").on("change", function () {
    userRequirements.planTerm = parseInt($(this).val());
    calculatePricing();
    updateUi();
  });
}

window.addEventListener("load", () => {
  initEventListners();
});

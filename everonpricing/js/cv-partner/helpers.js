import { BASE_URL } from '../config.js';

function getVirtualGreeterPrice(year, residenceCount, type, pricingData) {
  const data = pricingData.virtualGreeter[year];
  if (!data) return null;

  let match = data.find((entry) => residenceCount <= entry.residence);
  if (!match) match = data[data.length - 1];

  if (type == "primary") {
    return match.primary;
  }

  return match.secondary;
}

function getVirtualEngineerPrice(year, systemCount, withGuard = false, pricingData) {
  const data = pricingData.virtualEngineer[year];
  if (!data) return null;

  let match = data.find((entry) => systemCount <= entry.systems);
  if (!match) match = data[data.length - 1];

  return withGuard ? match.yesGuard : match.noGuard;
}

async function getCvPartnerPricing() {
  try {
    const request = await fetch(`${BASE_URL}data/cv-partner-pricing.json`);
    return request.json();
  } catch (e) {
    console.log(e)
  }
}

async function getCameraPricing() {
  try {
    const request = await fetch(`${BASE_URL}data/camera-pricing.json`);
    return request.json();
  } catch (e) {
    console.log(e)
  }
}

async function getCameraPricingForCvPartner() {
  try {
    const request = await fetch(`${BASE_URL}data/cv-camera-pricing.json`);
    return request.json();
  } catch (e) {
    console.log(e)
  }
}

function getVirtualGuardCameraPricing(agreementYears, numCameras, exactHours, cameraPricing) {

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

export {
  getVirtualEngineerPrice,
  getVirtualGreeterPrice,
  getCvPartnerPricing,
  getCameraPricing,
  getVirtualGuardCameraPricing,
  getCameraPricingForCvPartner
}
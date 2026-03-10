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
  if (exactHours <= 12) {
    hourRange = "1-12";
  } else if (exactHours <= 18) {
    hourRange = "13-18";
  } else {
    hourRange = "19-24";
  }

  // Determine the camera range key
  let cameraKey;
  if (numCameras <= 10) {
    cameraKey = numCameras.toString();
  } else if (numCameras <= 15) {
    cameraKey = "11-15";
  } else if (numCameras <= 20) {
    cameraKey = "16-20";
  } else if (numCameras <= 25) {
    cameraKey = "21-25";
  } else if (numCameras <= 50) {
    cameraKey = "26-50";
  } else if (numCameras <= 75) {
    cameraKey = "51-75";
  } else {
    cameraKey = "75-100";
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
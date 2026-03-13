import { BASE_URL } from '../config.js';

const CAMERA_PLAN_BY_TERM = {
  mtm: "3yr",
  "6m": "4yr",
  "1yr": "1yr",
  "2yr": "2yr",
  "3yr": "3yr",
};

const CV_MATRIX_TIER_BY_TERM = {
  mtm: null,
  "6m": null,
  "1yr": "1",
  "2yr": "2",
  "3yr": "3",
};

async function fetchJsonWithFallback(relativePath) {
  const sources = [`${BASE_URL}${relativePath}`, `./${relativePath}`];
  let lastError = null;

  for (const source of sources) {
    try {
      const request = await fetch(source, { cache: 'no-store' });
      if (!request.ok) {
        throw new Error(`Failed to load ${relativePath} from ${source}: ${request.status}`);
      }
      return await request.json();
    } catch (error) {
      lastError = error;
    }
  }

  console.log(lastError);
  return null;
}

function getVirtualGreeterPrice(year, residenceCount, type, pricingData) {
  const tierKey = CV_MATRIX_TIER_BY_TERM[year];
  if (!tierKey) return 0;

  const data = pricingData.virtualGreeter[tierKey];
  if (!data) return 0;

  let match = data.find((entry) => residenceCount <= entry.residence);
  if (!match) match = data[data.length - 1];

  if (type == "primary") {
    return match.primary;
  }

  return match.secondary;
}

function getVirtualEngineerPrice(year, systemCount, withGuard = false, pricingData) {
  const tierKey = CV_MATRIX_TIER_BY_TERM[year];
  if (!tierKey) return 0;

  const data = pricingData.virtualEngineer[tierKey];
  if (!data) return 0;

  let match = data.find((entry) => systemCount <= entry.systems);
  if (!match) match = data[data.length - 1];

  return withGuard ? match.yesGuard : match.noGuard;
}

async function getCvPartnerPricing() {
  return fetchJsonWithFallback('data/cv-partner-pricing.json');
}

async function getCameraPricing() {
  return fetchJsonWithFallback('data/camera-pricing.json');
}

async function getCameraPricingForCvPartner() {
  return fetchJsonWithFallback('data/cv-camera-pricing.json');
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

  const planKey = CAMERA_PLAN_BY_TERM[agreementYears];
  if (!planKey || !cameraPricing?.pricing?.[planKey]) {
    return 0;
  }

  const price = cameraPricing.pricing[planKey][hourRange][cameraKey];
  if (price === undefined) return 0;

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

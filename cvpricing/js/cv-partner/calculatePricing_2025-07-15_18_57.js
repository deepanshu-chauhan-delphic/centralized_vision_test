import { getVirtualEngineerPrice, getVirtualGreeterPrice, getVirtualGuardCameraPricing } from './helpers_2025-07-15_18_57.js'

function virtualGuardPrice(userRequirements, pricingQuotes, cameraPricing) {
    const holidayMonitorCost = 45;
    const totalHours = pricingQuotes.totalHours;
    const aiCameraCost = 5;
    const avgHours = Math.floor(totalHours / 7);

    const cameraCost = getVirtualGuardCameraPricing(
        userRequirements.contractTerm,
        userRequirements.numOfCam,
        avgHours,
        cameraPricing
    );

    const services = pricingQuotes.services;

    // secutiry cam monitor price
    if (userRequirements.numOfCam > 0) {
        services.securityCamMonitoring.wholeSale = (cameraCost * totalHours * 52) / 12;
    } else {
        services.securityCamMonitoring.wholeSale = 0;
    }
    services.securityCamMonitoring.priceToCustomer = services.securityCamMonitoring.wholeSale;

    if (userRequirements.numOfAiCam) {
        // ai camera monitor price
        services.aiCamMonitoring.wholeSale = userRequirements.numOfAiCam * aiCameraCost;
    } else {
        services.aiCamMonitoring.wholeSale = 0;
    }
    services.aiCamMonitoring.priceToCustomer = services.aiCamMonitoring.wholeSale;

    if (userRequirements.holidayMonitoringDays > 0) {
        // holiday cam monitor price
        services.holidayCamMonitoring.wholeSale = (holidayMonitorCost * userRequirements.holidayMonitoringDays) / 12;
    } else {
        services.holidayCamMonitoring.wholeSale = 0;
    }
    services.holidayCamMonitoring.priceToCustomer = services.holidayCamMonitoring.wholeSale;
}

function accessControlPrice(userRequirements, pricingQuotes) {
    if(userRequirements.accessControl.required) {
        if( userRequirements.accessControl.numOfPoints <= 50 ) {
            pricingQuotes.accessControl.monitor.wholesale  = 100; // logic sent by client
        }
        
        if( userRequirements.accessControl.numOfPoints > 50 ) {
            const extraPoints = userRequirements.accessControl.numOfPoints - 50;
            pricingQuotes.accessControl.monitor.wholesale = 100 + extraPoints; // logic sent by client
        }
        pricingQuotes.accessControl.monitor.retail = pricingQuotes.accessControl.monitor.wholesale;
    } else {
        pricingQuotes.accessControl.monitor.wholesale  = 0;
        pricingQuotes.accessControl.monitor.retail  = 0;
    }

    if(userRequirements.accessControl.accessControlDbManage == 1) {
        pricingQuotes.accessControl.databaseManage.wholesale = 125; // sent by client
    } else {
        pricingQuotes.accessControl.databaseManage.wholesale = 0;
    }
    pricingQuotes.accessControl.databaseManage.retail = pricingQuotes.accessControl.databaseManage.wholesale;

    // now calculate both total price
    if( userRequirements.accessControl.accessControlDbManage == 1 && userRequirements.accessControl.required == 1 ) {
        pricingQuotes.accessControl.both.wholesale = (pricingQuotes.accessControl.databaseManage.wholesale + pricingQuotes.accessControl.monitor.wholesale) - 50;
    } else {
        pricingQuotes.accessControl.both.wholesale = 0;
    }

    pricingQuotes.accessControl.both.retail = pricingQuotes.accessControl.both.wholesale; 
}

function virtualGreeterPrice(userRequirements, pricingQuotes, cvMatrixPricingData) {
    if(userRequirements.virtualGreet.required == 1) {
        const costFactor = getVirtualGreeterPrice(
            userRequirements.contractTerm,
            userRequirements.virtualGreet.numOfResidences,
            userRequirements.virtualGreet.contactType,
            cvMatrixPricingData
        );

        pricingQuotes.virtualGreet.wholesale = (costFactor * 24 * 365) / 12;
        pricingQuotes.virtualGreet.retail = pricingQuotes.virtualGreet.wholesale;
    } else {
        pricingQuotes.virtualGreet.wholesale = 0;
    }

    pricingQuotes.virtualGreet.retail = pricingQuotes.virtualGreet.wholesale;
}

function virtualEngPrice(userRequirements, pricingQuotes, cvMatrixPricingData) {
    if( userRequirements.virtualEng.required == 1 ) {
        const costFactor = getVirtualEngineerPrice(
            userRequirements.contractTerm,
            userRequirements.virtualEng.numOfSystem,
            userRequirements.virtualGuardSecurityMonitoring,
            cvMatrixPricingData
        );
        pricingQuotes.virtualEng.wholesale = (costFactor * 24 * 365 ) / 12;
    } else {
        pricingQuotes.virtualEng.wholesale = 0;
    }

    pricingQuotes.virtualEng.retail = pricingQuotes.virtualEng.wholesale;
}

function addMarkup(userRequirements, pricingQuotes) {
    if(userRequirements.markup == 0) {
        return;
    }

    if(pricingQuotes.services.securityCamMonitoring.wholeSale) {
        const securityCamMonitoring = pricingQuotes.services.securityCamMonitoring;
        securityCamMonitoring.priceToCustomer = securityCamMonitoring.wholeSale + (0.01 * userRequirements.markup * securityCamMonitoring.wholeSale);
    }
   
    if(pricingQuotes.accessControl.monitor.wholesale) {
        pricingQuotes.accessControl.monitor.retail = pricingQuotes.accessControl.monitor.wholesale + (
            0.01 * userRequirements.markup * pricingQuotes.accessControl.monitor.wholesale
        );
    }

    if(pricingQuotes.accessControl.databaseManage.wholesale) {
        pricingQuotes.accessControl.databaseManage.retail = pricingQuotes.accessControl.databaseManage.wholesale + (
            0.01 * userRequirements.markup * pricingQuotes.accessControl.databaseManage.wholesale
        );
    }

    if(pricingQuotes.accessControl.both.wholesale) {
        pricingQuotes.accessControl.both.retail = pricingQuotes.accessControl.databaseManage.retail + pricingQuotes.accessControl.monitor.retail;
    }

    if(pricingQuotes.virtualGreet.wholesale) {
        pricingQuotes.virtualGreet.retail = pricingQuotes.virtualGreet.wholesale + (
            0.01 * userRequirements.markup * pricingQuotes.virtualGreet.wholesale
        )
    }

    if(pricingQuotes.virtualEng.wholesale) {
        pricingQuotes.virtualEng.retail = pricingQuotes.virtualEng.wholesale + (
            0.01 * userRequirements.markup * pricingQuotes.virtualEng.wholesale
        )
    }
}

function getFinalPrice(
    userRequirements,
    pricingQuotes,
    cvMatrixPricingData,
    cameraPricing
) {
    virtualGuardPrice(userRequirements, pricingQuotes, cameraPricing);
    accessControlPrice(userRequirements, pricingQuotes);
    virtualGreeterPrice(userRequirements, pricingQuotes, cvMatrixPricingData);
    virtualEngPrice(userRequirements, pricingQuotes, cvMatrixPricingData);
    addMarkup(userRequirements, pricingQuotes);

    const totalServicePrice = (
        pricingQuotes.services.securityCamMonitoring.wholeSale +
        pricingQuotes.services.holidayCamMonitoring.wholeSale +
        pricingQuotes.services.aiCamMonitoring.wholeSale
    );

    pricingQuotes.totalCost.monthly.wholeSale = totalServicePrice;

    if( userRequirements.accessControl.accessControlDbManage == 1 && userRequirements.accessControl.required == 1 ) {
        pricingQuotes.totalCost.monthly.wholeSale += (pricingQuotes.accessControl.databaseManage.wholesale + pricingQuotes.accessControl.monitor.wholesale) - 50;
    }

    if( userRequirements.accessControl.accessControlDbManage == 0 && userRequirements.accessControl.required == 1 ) {
        pricingQuotes.totalCost.monthly.wholeSale += pricingQuotes.accessControl.databaseManage.wholesale + pricingQuotes.accessControl.monitor.wholesale;
    }

    pricingQuotes.totalCost.monthly.wholeSale += pricingQuotes.virtualGreet.wholesale;
    pricingQuotes.totalCost.monthly.wholeSale += pricingQuotes.virtualEng.wholesale;

    pricingQuotes.totalCost.monthly.retail = (
        pricingQuotes.services.securityCamMonitoring.priceToCustomer +
        pricingQuotes.services.holidayCamMonitoring.priceToCustomer +
        pricingQuotes.services.aiCamMonitoring.priceToCustomer
    );

    if( userRequirements.accessControl.accessControlDbManage == 1 && userRequirements.accessControl.required == 1 ) {
        pricingQuotes.totalCost.monthly.retail += (pricingQuotes.accessControl.databaseManage.retail + pricingQuotes.accessControl.monitor.retail) - 50;
    }

    if( userRequirements.accessControl.accessControlDbManage == 0 && userRequirements.accessControl.required == 1 ) {
        pricingQuotes.totalCost.monthly.retail += pricingQuotes.accessControl.databaseManage.retail + pricingQuotes.accessControl.monitor.retail;
    }

    pricingQuotes.totalCost.monthly.retail += (
        pricingQuotes.virtualGreet.retail +
        pricingQuotes.virtualEng.retail
    );

    pricingQuotes.totalCost.annually.wholeSale =  pricingQuotes.totalCost.monthly.wholeSale * 12;
    pricingQuotes.totalCost.annually.retail =  pricingQuotes.totalCost.monthly.retail * 12;
}


export default getFinalPrice;
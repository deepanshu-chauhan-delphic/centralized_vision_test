const ENV = 'prod';

const BASE_URLS = {
    local: './',
    dev: 'https://dev.ehostingguru.com/centralised-vision/',
    prod: 'https://centralizedvision.com/cvpricing/',
};

export const BASE_URL = BASE_URLS[ENV];

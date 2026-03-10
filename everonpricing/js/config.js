const ENV = 'prod';

const BASE_URLS = {
    local: 'http://localhost:8000/',
    dev: 'https://dev.ehostingguru.com/centralised-vision/',
    prod: 'https://centralizedvision.com/everonpricing/',
};

export const BASE_URL = BASE_URLS[ENV];

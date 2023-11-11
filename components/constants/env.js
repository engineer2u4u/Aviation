export const SERVER_URL = 'https://simplifyaero.vellas.net:8089/api_aviation_aone/api/Values/';
// export const SERVER_URL = 'https://simplifyaero.vellas.net:8089/arrowdemoapi_dev/api/Values/';
var global = {};
var userId = null;

export const setUser = (userData) => {
    userId = userData;
};

export const getUser = (userData) => {
    return userId;
};
export const setDomain = (url) => {
    global.domain_url = url;
};
export const getDomain = () => {
    return global.domain_url;
};
const http = require('../../utils/http');
module.exports = () => http.get(`organizations/objects/definitions`);
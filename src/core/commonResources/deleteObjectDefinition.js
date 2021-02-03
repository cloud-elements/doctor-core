const http = require('../../utils/http');
module.exports = async name => await http.delete(`organizations/objects/${name}/definitions`);
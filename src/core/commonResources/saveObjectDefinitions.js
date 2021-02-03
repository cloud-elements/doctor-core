const {identity, useWith} = require('ramda');
const http = require('../../utils/http');
const save = require('../../utils/saveToFile');

// (parms, env)
module.exports = useWith(save, [identity, http.get('organizations/objects/definitions')]);

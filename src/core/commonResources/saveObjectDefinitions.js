const {identity, useWith} = require('ramda');
const get = require('../../utils/get');
const save = require('../../utils/saveToFile');

// (parms, env)
module.exports = useWith(save, [identity, get('organizations/objects/definitions', '')]);

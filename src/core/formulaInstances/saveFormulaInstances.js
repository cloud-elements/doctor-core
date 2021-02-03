const {useWith, identity} = require('ramda');
const http = require('../../utils/http');
const save = require('../../utils/saveToFile');
const getFormulasInstances = http.get('formulas/instances');

// (parms)
module.exports = useWith(save, [identity, getFormulasInstances]);
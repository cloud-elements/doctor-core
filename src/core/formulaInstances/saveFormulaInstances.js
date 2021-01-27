const {useWith, identity} = require('ramda');
const getFormulasInstances = require('../../utils/get')('formulas/instances', '');
const save = require('../../utils/saveToFile');

// (parms)
module.exports = useWith(save, [identity, getFormulasInstances]);

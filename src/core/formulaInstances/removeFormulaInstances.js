const {__, converge, curry, map, pipe, prop, pipeP} = require('ramda');
const http = require('../../utils/http');

const getFormulaInstances = account => http.get('formulas/instances', {}, account);
const makePath = curry((formulaId, instanceId) => `formulas/${formulaId}/instances/${instanceId}`);
const deleteFormulaInstance = curry((endpoint, account) => http.delete(endpoint, {}, account));

module.exports = account =>
  pipeP(
    getFormulaInstances,
    map(pipe(converge(makePath, [pipe(prop('formula'), prop('id')), prop('id')]), deleteFormulaInstance(__, account))),
  )(account);

const {map, pipe, converge, prop, curry, pipeP} = require('ramda');
const http = require('../../utils/http');

const getFormulaInstances = () => http.get('formulas/instances');
const makePath = curry((formulaId, instanceId) => `formulas/${formulaId}/instances/${instanceId}`);

module.exports = pipeP(
  getFormulaInstances,
  map(pipe(converge(makePath, [pipe(prop('formula'), prop('id')), prop('id')]), http.delete)),
);
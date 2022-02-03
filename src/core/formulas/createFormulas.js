/* eslint-disable no-useless-catch */
const {map, find, propEq, mergeAll, curry, equals, assocPath, isNil, isEmpty} = require('ramda');
const {emitter, EventTopic} = require('../../events/emitter');
const {isJobCancelled} = require('../../events/cancelled-job');
const {Assets, ArtifactStatus} = require('../../constants/artifact');
const http = require('../../utils/http');
const {logDebug, logError} = require('../../utils/logger');

const makePath = formula => `formulas/${formula.id}`;
const isNilOrEmpty = val => isNil(val) || isEmpty(val);

const createFormula = curry(async (account, endpointFormulas, jobId, processId, formula) => {
  try {
    const endpointFormula = !isNilOrEmpty(endpointFormulas) ? find(propEq('name', formula.name))(endpointFormulas) : [];
    if (!isNilOrEmpty(endpointFormula)) {
      return {[formula.id]: endpointFormula.id};
    }
    if (isJobCancelled(jobId)) {
      emitter.emit(EventTopic.ASSET_STATUS, {
        processId,
        assetType: Assets.FORMULAS,
        assetName: formula.name,
        assetStatus: ArtifactStatus.CANCELLED,
        error: 'job is cancelled',
        metadata: '',
      });
      return null;
    }

    emitter.emit(EventTopic.ASSET_STATUS, {
      processId,
      assetType: Assets.FORMULAS,
      assetName: formula.name,
      assetStatus: ArtifactStatus.INPROGRESS,
      metadata: '',
    });

    logDebug(`Creating formula for formula name - ${formula.name}`, jobId);
    const result = await http.post('formulas', formula, account);
    logDebug(`Created formula for formula name - ${formula.name}`, jobId);

    emitter.emit(EventTopic.ASSET_STATUS, {
      processId,
      assetType: Assets.FORMULAS,
      assetName: formula.name,
      assetStatus: ArtifactStatus.COMPLETED,
      metadata: '',
    });
    return {[formula.id]: result.id};
  } catch (error) {
    emitter.emit(EventTopic.ASSET_STATUS, {
      processId,
      assetType: Assets.FORMULAS,
      assetName: formula.name,
      assetStatus: ArtifactStatus.FAILED,
      error: error.toString(),
      metadata: '',
    });
    throw error;
  }
});

// eslint-disable-next-line consistent-return
const updateFormula = curry(async (account, jobId, processId, formula) => {
  try {
    if (isJobCancelled(jobId)) {
      emitter.emit(EventTopic.ASSET_STATUS, {
        processId,
        assetType: Assets.FORMULAS,
        assetName: formula.name,
        assetStatus: ArtifactStatus.CANCELLED,
        error: 'job is cancelled',
        metadata: '',
      });
      return null;
    }

    logDebug(`Uploading formula for formula name - ${formula.name}`, jobId);
    await http.update(makePath(formula), formula, account);
    logDebug(`Uploaded formula for formula name - ${formula.name}`, jobId);

    emitter.emit(EventTopic.ASSET_STATUS, {
      processId,
      assetType: Assets.FORMULAS,
      assetName: formula.name,
      assetStatus: ArtifactStatus.COMPLETED,
      metadata: '',
    });
  } catch (error) {
    logError(`Failed to create/upload formula ${error}`, jobId);
    emitter.emit(EventTopic.ASSET_STATUS, {
      processId,
      assetType: Assets.FORMULAS,
      assetName: formula.name,
      assetStatus: ArtifactStatus.FAILED,
      error: error.toString(),
      metadata: '',
    });
    throw error;
  }
});

const getSubFormulaIds = curry((endpointFormulas, formula) => {
  const subFrmlaIds = {};
  const subFormulas = !isNilOrEmpty(formula.subFormulas) ? formula.subFormulas : [];
  subFormulas.forEach(subFormula => {
    const endpointFormula = !isNilOrEmpty(endpointFormulas)? find(propEq('name', subFormula.name))(endpointFormulas): [];
    if (!isNilOrEmpty(endpointFormula)) {
      subFrmlaIds[subFormula.id] = endpointFormula.id;
    }
  });
  return subFrmlaIds;
});

module.exports = async (account, formulas, jobId, processId) => {
  try {
    const endpointFormulas = await http.get('formulas', {}, account);
    const formulaIds = mergeAll(
      await Promise.all(map(createFormula(account, endpointFormulas, jobId, processId))(formulas)),
    );
    const subformulaIds = mergeAll(map(getSubFormulaIds(endpointFormulas))(formulas));
    const fixSteps = map(step =>
      equals(step.type, 'formula')
        ? assocPath(['properties', 'formulaId'],
            formulaIds[step.properties.formulaId] || subformulaIds[step.properties.formulaId] || step.properties.formulaId,
            step)
        : step,
    );
    const newFormulas = map(formula => ({
      ...formula,
      id: formulaIds[formula.id],
      steps: fixSteps(formula.steps),
      subFormulas: !isNilOrEmpty(formula.subFormulas)
        ? map(step => ({
            ...step,
            id: formulaIds[step.id],
            steps: fixSteps(step.steps),
          }))(formula.subFormulas)
        : [],
    }))(formulas);
    logDebug('Initiating the upload process for formulas', jobId);
    return Promise.all(map(updateFormula(account, jobId, processId))(newFormulas));
  } catch (error) {
    logError(`Failed to upload formulas: ${error}`, jobId);
    throw error;
  }
};

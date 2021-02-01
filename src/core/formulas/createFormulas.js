/* eslint-disable no-useless-catch */
const {map, find, propEq, mergeAll, curry, equals, assocPath} = require('ramda');
const {emitter, EventTopic} = require('../../events/emitter');
const {isJobCancelled} = require('../../events/cancelled-job');
const {Assets, ArtifactStatus} = require('../../constants/artifact');
const http = require('../../utils/http');
const {logDebug} = require('../../utils/logger');
const {isNilOrEmpty} = require('../../utils/common');

const makePath = formula => `formulas/${formula.id}`;

const createFormula = curry(async (endpointFormulas, jobId, processId, formula) => {
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
    logDebug(`Creating formula for formula name - ${formula.name}`);
    const result = await http.post('formulas', formula);
    logDebug(`Created formula for formula name - ${formula.name}`);
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
const updateFormula = curry(async (jobId, processId, formula) => {
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
    logDebug(`Uploading formula for formula name - ${formula.name}`);
    await http.update(makePath(formula), formula);
    logDebug(`Uploaded formula for formula name - ${formula.name}`);
    emitter.emit(EventTopic.ASSET_STATUS, {
      processId,
      assetType: Assets.FORMULAS,
      assetName: formula.name,
      assetStatus: ArtifactStatus.COMPLETED,
      metadata: '',
    });
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

module.exports = async (formulas, jobId, processId) => {
  try {
    const endpointFormulas = await http.get('formulas', '');
    const formulaIds = mergeAll(await Promise.all(map(createFormula(endpointFormulas, jobId, processId))(formulas)));
    const fixSteps = map(step =>
      equals(step.type, 'formula')
        ? assocPath(['properties', 'formulaId'], formulaIds[step.properties.formulaId] || -1, step)
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
    logDebug('Initiating the upload process for formulas');
    return Promise.all(map(updateFormula(jobId, processId))(newFormulas));
  } catch (error) {
    throw error;
  }
};

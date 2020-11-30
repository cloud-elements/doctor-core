'use strict';
const {type, join} = require('ramda');
const {emitter, EventTopic} = require('../events/emitter');
const {isJobCancelled} = require('../events/cancelled-job');
const {Assets, ArtifactStatus} = require('../constants/artifact');
const get = require('./get');
const applyQuotes = require('./quoteString');
const logDebug = require('./logger');

module.exports = async (formulaKeys, jobId, processId) => {
  let param = '';
  let formulaNames = [];
  if (type(formulaKeys) === 'String') {
    formulaNames = formulaKeys.split(',');
    param = {where: 'name in (' + applyQuotes(join(',', formulaNames)) + ')'};
  } else if (Array.isArray(formulaKeys)) {
    formulaNames = formulaKeys.map((formula) => formula.name);
    param = {where: 'name in (' + applyQuotes(join(',', formulaNames)) + ')'};
  } else {
    return get('formulas', param);
  }
  try {
    logDebug('Initiating the download process for formulas');
    if (isJobCancelled(jobId)) {
      formulaNames.forEach((formulaName) =>
        emitter.emit(EventTopic.ASSET_STATUS, {
          processId,
          assetType: Assets.FORMULAS,
          assetName: formulaName,
          assetStatus: ArtifactStatus.CANCELLED,
          error: 'job is cancelled',
          metadata: '',
        }),
      );
      return [];
    }
    logDebug('Downloading formulas');
    const exportedFormulas = await get('formulas', param);
    logDebug('Downloaded formulas');
    formulaNames.forEach((formulaName) =>
      emitter.emit(EventTopic.ASSET_STATUS, {
        processId,
        assetType: Assets.FORMULAS,
        assetName: formulaName,
        assetStatus: ArtifactStatus.COMPLETED,
        metadata: '',
      }),
    );
    const newlyCreatedFormulas =
      formulaKeys && Array.isArray(formulaKeys)
        ? formulaKeys.filter((key) => !exportedFormulas.some((formula) => formula.name == key.name))
        : [];
    newlyCreatedFormulas.forEach((formula) =>
      emitter.emit(EventTopic.ASSET_STATUS, {
        processId,
        assetType: Assets.FORMULAS,
        assetName: formula.name,
        metadata: '',
        isNew: true,
      }),
    );
    return exportedFormulas;
  } catch (error) {
    formulaNames.forEach((formulaName) =>
      emitter.emit(EventTopic.ASSET_STATUS, {
        processId,
        assetType: Assets.FORMULAS,
        assetName: formulaName,
        assetStatus: ArtifactStatus.FAILED,
        error: error.toString(),
        metadata: '',
      }),
    );
    throw error;
  }
};

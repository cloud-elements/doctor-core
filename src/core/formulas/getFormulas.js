const {equals, join, type} = require('ramda');
const {emitter, EventTopic} = require('../../events/emitter');
const {isJobCancelled} = require('../../events/cancelled-job');
const {Assets, ArtifactStatus, JobType} = require('../../constants/artifact');
const http = require('../../utils/http');
const applyQuotes = require('../../utils/quoteString');
const {logDebug, logError} = require('../../utils/logger');

module.exports = async (account, formulaKeys, jobId, processId, jobType) => {
  let param = '';
  let formulaNames = [];

  if (type(formulaKeys) === 'String') {
    formulaNames = formulaKeys.split(',');
    param = {where: `name in (${applyQuotes(join(',', formulaNames))})`};
  } else if (Array.isArray(formulaKeys)) {
    formulaNames = formulaKeys.map(formula => formula.name);
    param = {where: `name in (${applyQuotes(join(',', formulaNames))})`};
  } else {
    return http.get('formulas', param, account);
  }

  try {
    logDebug('Initiating the download process for formulas', jobId);
    if (isJobCancelled(jobId)) {
      formulaNames.forEach(formulaName =>
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

    logDebug('Downloading formulas', jobId);
    const exportedFormulas = await http.get('formulas', param, account);
    logDebug('Downloaded formulas', jobId);

    formulaNames.forEach(formulaName =>
      emitter.emit(EventTopic.ASSET_STATUS, {
        processId,
        assetType: Assets.FORMULAS,
        assetName: formulaName,
        assetStatus: equals(jobType, JobType.PROMOTE_EXPORT) ? ArtifactStatus.INPROGRESS : ArtifactStatus.COMPLETED,
        metadata: '',
      }),
    );

    const newlyCreatedFormulas =
      formulaKeys && Array.isArray(formulaKeys)
        ? formulaKeys.filter(key => !exportedFormulas.some(formula => formula.name === key.name))
        : [];

    newlyCreatedFormulas.forEach(formula =>
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
    formulaNames.forEach(formulaName =>
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

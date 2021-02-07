const {isEmpty} = require('ramda');
const {emitter, EventTopic} = require('../../events/emitter');
const http = require('../../utils/http');
const {isJobCancelled} = require('../../events/cancelled-job');
const {Assets, ArtifactStatus} = require('../../constants/artifact');
const getFormulas = require('./getFormulas');
const {logDebug} = require('../../utils/logger');

module.exports = async (account, options) => {
  const {name, jobId, processId} = options;
  const formulas = await getFormulas(account, name);
  if (isEmpty(formulas)) {
    logDebug(`The doctor was unable to find the formula ${name}.`);
    return;
  }

  logDebug('Initiating the delete process for formulas');
  // eslint-disable-next-line consistent-return
  const removePromises = await formulas.map(async formula => {
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

      logDebug(`Deleting formula for formula name - ${formula.name}`);
      await http.delete(`formulas/${formula.id}`, {}, account);
      logDebug(`Deleted formula for formula name - ${formula.name}`);

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
  await Promise.all(removePromises);
};

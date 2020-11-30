'use strict';
const {emitter, EventTopic} = require('../events/emitter');
const {isJobCancelled} = require('../events/cancelled-job');
const {Assets, ArtifactStatus} = require('../constants/artifact');
const {isEmpty} = require('ramda');
const remove = require('../util/remove');
const getFormulas = require('../util/getFormulas');
const { logDebug } = require('../util/logger');
const makePath = (id) => `formulas/${id}`;

module.exports = async (options) => {
  const {name, jobId, processId} = options;
  const formulas = await getFormulas(name);
  if (isEmpty(formulas)) {
    logDebug(`The doctor was unable to find the formula ${name}.`);
    return;
  }
  logDebug('Initiating the delete process for formulas');
  const removePromises = await formulas.map(async (formula) => {
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
      await remove(makePath(formula.name));
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
  Promise.all(removePromises);
};

'use strict';
const { isEmpty } = require('ramda');
const { Assets, ArtifactStatus } = require('../../constants/artifact');
const { emitter, EventTopic } = require('../../events/emitter');
const { isJobCancelled } = require('../../events/cancelled-job');
const http = require('../../util/http');
const getPrivateElements = require('../../util/elements/getPrivateElements');
const logDebug = require('../../util/logger');
const makePath = (id) => `elements/${id}`;

module.exports = async (options) => {
  const { name, jobId, processId } = options;
  const elements = await getPrivateElements(name);
  if (isEmpty(elements)) {
    logDebug(`The doctor was unable to find the element ${name}.`);
    return;
  }
  logDebug('Initiating the delete process for elements');
  const removePromises = await elements.map(async (element) => {
    try {
      if (isJobCancelled(jobId)) {
        emitter.emit(EventTopic.ASSET_STATUS, {
          processId,
          assetType: Assets.ELEMENTS,
          assetName: element.key,
          assetStatus: ArtifactStatus.CANCELLED,
          error: 'job is cancelled',
          metadata: '',
        });
        return null;
      }
      logDebug(`Deleting element for element key - ${element.key}`);
      await http.delete(makePath(element.id));
      logDebug(`Deleted element for element key - ${element.key}.`);
      emitter.emit(EventTopic.ASSET_STATUS, {
        processId,
        assetType: Assets.ELEMENTS,
        assetName: element.key,
        assetStatus: ArtifactStatus.COMPLETED,
        metadata: '',
      });
    } catch (error) {
      emitter.emit(EventTopic.ASSET_STATUS, {
        processId,
        assetType: Assets.ELEMENTS,
        assetName: element.key,
        assetStatus: ArtifactStatus.FAILED,
        error: error.toString(),
        metadata: '',
      });
      throw error;
    }
  });
  Promise.all(removePromises);
};

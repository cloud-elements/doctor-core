'use strict';
const {mapObjIndexed, values} = require('ramda');
const update = require('../../../util/update');
const {emitter, EventTopic} = require('../../../events/emitter');
const {isJobCancelled} = require('../../../events/cancelled-job');
const {Assets, ArtifactStatus} = require('../../../constants/artifact');
const { logDebug } = require('../../../util/logger');

module.exports = async (vdrs, jobId, processId) => {
  const uploadPromises = mapObjIndexed(async (vdr, vdrName) => {
    try {
      if (isJobCancelled(jobId)) {
        emitter.emit(EventTopic.ASSET_STATUS, {
          processId,
          assetType: Assets.VDRS,
          assetName: vdrName,
          assetStatus: ArtifactStatus.CANCELLED,
          error: 'job is cancelled',
          metadata: '',
        });
        return null;
      }
      logDebug(`Uploading VDR for VDR name - ${vdrName}`);
      await update('vdrs/import', vdr);
      logDebug(`Uploaded VDR for VDR name - ${vdrName}`);
      emitter.emit(EventTopic.ASSET_STATUS, {
        processId,
        assetType: Assets.VDRS,
        assetName: vdrName,
        assetStatus: ArtifactStatus.COMPLETED,
        metadata: '',
      });
    } catch (error) {
      emitter.emit(EventTopic.ASSET_STATUS, {
        processId,
        assetType: Assets.VDRS,
        assetName: vdrName,
        assetStatus: ArtifactStatus.FAILED,
        error: error.toString(),
        metadata: '',
      });
      throw error;
    }
  }, vdrs);
  return Promise.all(values(uploadPromises));
};

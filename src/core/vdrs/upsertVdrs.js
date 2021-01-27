const {mapObjIndexed, values} = require('ramda');
const http = require('../../utils/http');
const {emitter, EventTopic} = require('../../events/emitter');
const {isJobCancelled} = require('../../events/cancelled-job');
const {Assets, ArtifactStatus} = require('../../constants/artifact');
const {logDebug} = require('../../utils/logger');

module.exports = async (vdrs, jobId, processId) => {
  // eslint-disable-next-line consistent-return
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
      await http.update('vdrs/import', vdr);
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

const {forEachObjIndexed, isEmpty} = require('ramda');
const {emitter, EventTopic} = require('../../events/emitter');
const {isJobCancelled} = require('../../events/cancelled-job');
const {Assets, ArtifactStatus} = require('../../constants/artifact');
const remove = require('../../utils/remove');
const getVdrs = require('../vdrs/getVdrs');
const {logDebug} = require('../../utils/logger');

const makePath = vdrname => `common-resources/${vdrname}`;

module.exports = async options => {
  const {name, jobId, processId} = options;
  const vdrs = await getVdrs(name);
  if (isEmpty(vdrs)) {
    logDebug(`The doctor was unable to find the vdrs ${name}.`);
    return;
  }
  logDebug('Initiating the delete process for VDRs');
  // eslint-disable-next-line consistent-return
  await forEachObjIndexed(async vdr => {
    try {
      if (isJobCancelled(jobId)) {
        emitter.emit(EventTopic.ASSET_STATUS, {
          processId,
          assetType: Assets.VDRS,
          assetName: vdr.vdrName,
          assetStatus: ArtifactStatus.CANCELLED,
          error: 'job is cancelled',
          metadata: '',
        });
        return null;
      }
      logDebug(`Deleting VDR for VDR name - ${vdr.vdrName}`);
      await remove(makePath(vdr.vdrName), {force: true});
      logDebug(`Deleted VDR for VDR name - ${vdr.vdrName}`);
      emitter.emit(EventTopic.ASSET_STATUS, {
        processId,
        assetType: Assets.VDRS,
        assetName: vdr.vdrName,
        assetStatus: ArtifactStatus.COMPLETED,
        metadata: '',
      });
    } catch (error) {
      emitter.emit(EventTopic.ASSET_STATUS, {
        processId,
        assetType: Assets.VDRS,
        assetName: vdr.vdrName,
        assetStatus: ArtifactStatus.FAILED,
        error: error.toString(),
        metadata: '',
      });
      throw error;
    }
  }, vdrs);
};

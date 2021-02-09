const {equals, indexBy, isEmpty, isNil, pipe, reject, prop} = require('ramda');
const http = require('../../utils/http');
const {emitter, EventTopic} = require('../../events/emitter');
const {isJobCancelled} = require('../../events/cancelled-job');
const {Assets, ArtifactStatus, JobType} = require('../../constants/artifact');
const {logDebug} = require('../../utils/logger');

const isNilOrEmpty = val => isNil(val) || isEmpty(val);
const transduceVdrs = vdrs => (!isNilOrEmpty(vdrs) ? pipe(reject(isNil), indexBy(prop('vdrName')))(vdrs) : {});

const downloadVdrs = async (vdrNames, jobId, processId, jobType, account) => {
  logDebug('Initiating the download process for VDRs', jobId);
  const downloadPromise = await vdrNames.map(async vdrName => {
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

      logDebug(`Downloading VDR for VDR name - ${vdrName}`, jobId);
      const exportedVdr = await http.get(`/vdrs/${vdrName}/export`, {}, account);
      logDebug(`Downloaded VDR for VDR name - ${vdrName}`, jobId);

      emitter.emit(EventTopic.ASSET_STATUS, {
        processId,
        assetType: Assets.VDRS,
        assetName: vdrName,
        assetStatus: equals(jobType, JobType.PROMOTE_EXPORT) ? ArtifactStatus.INPROGRESS : ArtifactStatus.COMPLETED,
        metadata: '',
      });
      return !isNilOrEmpty(exportedVdr) ? exportedVdr : {};
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
  });
  const vdrsExport = await Promise.all(downloadPromise);
  return transduceVdrs(vdrsExport);
};

module.exports = async (vdrNames, inputVdrs, jobId, processId, jobType, account) => {
  const vdrs = await downloadVdrs(vdrNames, jobId, processId, jobType, account);
  const newlyCreated =
    inputVdrs && Array.isArray(inputVdrs) ? inputVdrs.filter(vdr => !vdrNames.includes(vdr.name)) : [];
  newlyCreated.forEach(vdr =>
    emitter.emit(EventTopic.ASSET_STATUS, {
      processId,
      assetType: Assets.VDRS,
      assetName: vdr.name,
      metadata: '',
      isNew: true,
    }),
  );
  return vdrs;
};

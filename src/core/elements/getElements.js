/* eslint-disable no-unused-expressions */
/* eslint-disable no-return-assign */
/* eslint-disable no-nested-ternary */
const {forEach, isNil, isEmpty, equals, pipe, reject} = require('ramda');
const getExtendedElements = require('./getExtendedElements');
const getPrivateElements = require('./getPrivateElements');
const {emitter, EventTopic} = require('../../events/emitter');
const {isJobCancelled} = require('../../events/cancelled-job');
const {Assets, ArtifactStatus, JobType} = require('../../constants/artifact');
const {logDebug, logError} = require('../../utils/logger');
const http = require('../../utils/http');

const makePath = element => `elements/${element.id}/export`;
const isNilOrEmpty = val => isNil(val) || isEmpty(val);
const clearNull = pipe(reject(isNil));

const downloadElements = async (elements, query, jobId, processId, isPrivate, jobType, account) => {
  logDebug('Initiating the download process for elements', jobId);
  const downloadPromises = elements.map(async element => {
    const elementMetadata = JSON.stringify({private: isPrivate});
    try {
      if (isJobCancelled(jobId)) {
        emitter.emit(EventTopic.ASSET_STATUS, {
          processId,
          assetType: Assets.ELEMENTS,
          assetName: element.key,
          assetStatus: ArtifactStatus.CANCELLED,
          error: 'job is cancelled',
          metadata: elementMetadata,
        });
        return null;
      }

      if (!equals(jobType, JobType.PROMOTE_EXPORT)) {
        emitter.emit(EventTopic.ASSET_STATUS, {
          processId,
          assetType: Assets.ELEMENTS,
          assetName: element.key,
          assetStatus: ArtifactStatus.INPROGRESS,
          metadata: elementMetadata,
        });
      }

      logDebug(`Downloading element for element key - ${element.key}`, jobId);
      const exportedElement = await http.get(makePath(element), query, account);
      logDebug(`Downloaded element for element key - ${element.key}`, jobId);

      // If 'promote_export' job, the final artifact
      // status update will happen in doctor-service
      if (!equals(jobType, JobType.PROMOTE_EXPORT)) {
        emitter.emit(EventTopic.ASSET_STATUS, {
          processId,
          assetType: Assets.ELEMENTS,
          assetName: element.key,
          assetStatus: ArtifactStatus.COMPLETED,
          metadata: elementMetadata,
        });
      }
      return !isNilOrEmpty(exportedElement) ? exportedElement : {};
    } catch (error) {
      emitter.emit(EventTopic.ASSET_STATUS, {
        processId,
        assetType: Assets.ELEMENTS,
        assetName: element.key,
        assetStatus: ArtifactStatus.FAILED,
        error: error.toString(),
        metadata: elementMetadata,
      });
      throw error;
    }
  });

  const elementsExport = await Promise.all(downloadPromises);
  return clearNull(elementsExport);
};

module.exports = async (account, elementKeys, jobId, processId, jobType) => {
  // From CLI - User can pass comma seperated string of elementKeys
  // From Doctor-service - elementKeys will be in Array of objects containing key and private flag
  try {
    const extendedElements = await getExtendedElements(elementKeys, jobId, account);
    const privateElements = await getPrivateElements(elementKeys, jobId, account);

    // Fetch all the private elements again to get all required/hydrated fields.
    const privateElementsExport = await downloadElements(
      privateElements,
      {},
      jobId,
      processId,
      /* isPrivate */ true,
      jobType,
      account,
    );

    // For private elements, private flag won't get populated if we cloned any system element
    !isNilOrEmpty(privateElementsExport) && forEach(element => (element.private = true), privateElementsExport);

    // Fetch all the extended elements again to get all required/hydrated fields.
    const extendedElementsExport = await downloadElements(
      extendedElements,
      {extendedOnly: true},
      jobId,
      processId,
      /* isPrivate */ false,
      jobType,
      account,
    );

    const elements = isNilOrEmpty(privateElementsExport)
      ? isNilOrEmpty(extendedElementsExport)
        ? []
        : extendedElementsExport
      : isNilOrEmpty(extendedElementsExport)
        ? privateElementsExport
        : privateElementsExport.concat(extendedElementsExport);

    const newlyCreatedElements =
      !isNilOrEmpty(elementKeys) && Array.isArray(elementKeys)
        ? elementKeys.filter(
          elementKey => elementKey.private && !privateElements.some(element => equals(element.key, elementKey.key)),
        )
        : [];

    newlyCreatedElements.forEach(element =>
      emitter.emit(EventTopic.ASSET_STATUS, {
        processId,
        assetType: Assets.ELEMENTS,
        assetName: element.key,
        metadata: JSON.stringify({private: true}),
        isNew: true,
      }),
    );
    return elements;
  } catch (error) {
    logError(`Error occured while retrieving elements: ${error}`, jobId);
    throw error;
  }
};

/* eslint-disable no-nested-ternary */
const {isNil, isEmpty, equals, concat, find, filter, propOr, pipe, pluck, uniq, join, has, toLower} = require('ramda');
const {emitter, EventTopic} = require('../../events/emitter');
const {isJobCancelled} = require('../../events/cancelled-job');
const {Assets, ArtifactStatus} = require('../../constants/artifact');
const applyQuotes = require('../../utils/quoteString');
const getExtendedElements = require('./getExtendedElements');
const getPrivateElements = require('./getPrivateElements');

const makePath = element => `elements/${element.key}`;
const http = require('../../utils/http');
const {logDebug, logError} = require('../../utils/logger');

const isNilOrEmpty = val => isNil(val) || isEmpty(val);

const fetchAllElements = async (elementsToImport, account) => {
  const elementsKeyString = !isNilOrEmpty(elementsToImport)
    ? pipe(pluck('key'), uniq, join(','))(elementsToImport)
    : '';
  const privateElements = await getPrivateElements(elementsKeyString, _, account);
  const extendedElements = await getExtendedElements(elementsKeyString, _, account);
  return concat(privateElements, extendedElements);
};

const fetchExtendedAndPrivateResources = async (existingElementId, elementKey, account) => {
  try {
    // GET /resources will always return private element resources if exists
    let extendedResources;
    if (isNilOrEmpty(existingElementId)) {
      extendedResources = await http.get(`elements/${elementKey}/resources`, '', account);
    } else {
      const extendedElement = await http.get(`elements/${existingElementId}`, '', account);
      extendedResources = propOr([], 'resources')(extendedElement);
    }
    return !isNilOrEmpty(extendedResources)
      ? filter(resource => !equals(resource.ownerAccountId, 1), extendedResources)
      : [];
  } catch (error) {
    logError(`Failed to retrieve extended and private elements: ${error.message}`);
    throw error;
  }
};

module.exports = async (elements, jobId, processId, account) => {
  logDebug('Initiating the upload process for elements');
  const allElements = await fetchAllElements(elements, account);
  
  // eslint-disable-next-line consistent-return
  const uploadPromise = await elements.map(async element => {
    // Here we need to identify whether the element is already present or not
    // Get all the elements at user account level and check the existence of the element
    const existingElement = find(searchElement =>
      equals(toLower(element.key), toLower(searchElement.key))
        ? has('private', element)
          ? equals(element.private, searchElement.private) && !searchElement.extended
          : equals(element.extended, searchElement.extended) && !searchElement.private
        : false,
    )(allElements);
    const elementMetadata = equals(element.private, true)
      ? JSON.stringify({private: true})
      : JSON.stringify({private: false});
    
      try {
      if (await isJobCancelled(jobId)) {
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
      
      logDebug(`Uploading element for element key - ${element.key}`);
      if (isNilOrEmpty(existingElement)) {
        // Element doesn't exists in the db for given account
        if (element.private === true || element.actuallyExtended === false) {
          // Create non-extended element (Private element)
          const importedElement = await http.post('elements', element, account);
          logDebug(`Uploaded element for element key - ${element.key}`);
          emitter.emit(EventTopic.ASSET_STATUS, {
            processId,
            assetType: Assets.ELEMENTS,
            assetName: element.key,
            assetStatus: ArtifactStatus.COMPLETED,
            metadata: elementMetadata,
          });
          logDebug(`Created Element: ${element.key}`);
          return importedElement;
        }
        
        const promisesList = {createdResources: [], updatedResources: []};
        if (!isNilOrEmpty(element.resources)) {
          // If we try to create resource based on element key then it will always
          // create resource in private element if exists
          const elementsForKey = await http.get(Assets.ELEMENTS, {where: `key = ${applyQuotes(element.key)}`}, account);
          const systemElementToExtend = !isNilOrEmpty(elementsForKey)
            ? find(searchElement =>
                equals(element.key, searchElement.key) && has('private', searchElement)
                  ? !searchElement.private
                  : false,
              )(elementsForKey)
            : [];
          if (isNilOrEmpty(systemElementToExtend) || isNilOrEmpty(systemElementToExtend.id)) {
            element.resources.forEach(resource => {
              promisesList.createdResources.push(http.post(`elements/${element.key}/resources`, resource, account));
              logDebug(`Resource Created: ${resource.method} - ${resource.path}`);
            });
          } else {
            element.resources.forEach(resource => {
              promisesList.createdResources.push(http.post(`elements/${systemElementToExtend.id}/resources`, resource, account));
              logDebug(`Resource Created: ${resource.method} - ${resource.path}`);
            });
          }
        }
        
        logDebug(`Uploaded element for element key - ${element.key}`);
        emitter.emit(EventTopic.ASSET_STATUS, {
          processId,
          assetType: Assets.ELEMENTS,
          assetName: element.key,
          assetStatus: ArtifactStatus.COMPLETED,
          metadata: elementMetadata,
        });
        // Combine both the promises list and resolve all
        const allPromisesToResolve = concat(promisesList.createdResources, promisesList.updatedResources);
        await Promise.all(allPromisesToResolve);
      } else {
        // Element exists in the db for given account
        if (element.private === true || element.actuallyExtended === false) {
          // Create non-extended element (Private element)
          const importedElement = await http.update(makePath(element), element, account);
          logDebug(`Uploaded element for element key - ${element.key}`);
          emitter.emit(EventTopic.ASSET_STATUS, {
            processId,
            assetType: Assets.ELEMENTS,
            assetName: element.key,
            assetStatus: ArtifactStatus.COMPLETED,
            metadata: elementMetadata,
          });
          return importedElement;
        }
        
        // Extend the element resources and element configurations (TODO)
        const promisesList = {createdResources: [], updatedResources: []};
        const extendedResources = await fetchExtendedAndPrivateResources(existingElement.id, element.key, account);
        if (!isNilOrEmpty(element.resources)) {
          element.resources.forEach(resource => {
            const existingResource = find(
              extendedResource =>
                equals(extendedResource.method, resource.method) &&
                equals(extendedResource.path, resource.path) &&
                equals(extendedResource.type, resource.type),
            )(extendedResources);
            if (isNilOrEmpty(existingResource)) {
              promisesList.createdResources.push(http.post(`elements/${existingElement.id}/resources`, resource, account));
              logDebug(`Resource Created: ${resource.method} - ${resource.path}`);
            } else {
              promisesList.updatedResources.push(
                http.update(`elements/${existingElement.id}/resources/${existingResource.id}`, resource, account),
              );
              logDebug(`Resource Updated: ${resource.method} - ${resource.path}`);
            }
          });
        }
        
        logDebug(`Uploaded element for element key - ${element.key}`);
        emitter.emit(EventTopic.ASSET_STATUS, {
          processId,
          assetType: Assets.ELEMENTS,
          assetName: element.key,
          assetStatus: ArtifactStatus.COMPLETED,
          metadata: elementMetadata,
        });
        // Combine both the promises list and resolve all
        const allPromisesToResolve = concat(promisesList.createdResources, promisesList.updatedResources);
        await Promise.all(allPromisesToResolve);
      }
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
  await Promise.all(uploadPromise);
};

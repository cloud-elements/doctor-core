const candidateId = steps.postNewBullhornCandidate.response.body.externalId;
const customerDefinedField = config.tagIdField;
const customerDefinedValue = config.tagIdValue;
const status = config.statusIdValue;
const source = config.sourceValue;
const jobId = steps.getJobOrderIdFromEvent

done(Object.assign({}, {candidateId, customerDefinedField, customerDefinedValue, status, source, jobId}))
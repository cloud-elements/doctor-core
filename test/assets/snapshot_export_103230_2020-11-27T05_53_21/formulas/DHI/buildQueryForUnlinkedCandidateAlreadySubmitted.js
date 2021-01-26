let query = {}; 
let jobOrderId = steps.getJobOrderIdFromEvent; 
let tagIdField = config.tagIdField; 
let tagIdValue = config.tagIdValue; 
let candidateId = Number(steps.loopLastNameMatches.entry.externalId);

query.where = `jobOrder.id = ${jobOrderId} AND ${tagIdField} = '${tagIdValue}' AND candidate.id = ${candidateId}`; 

query.includeDeleted = true;

done({query})
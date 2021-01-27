let query = {}
let jobOrderId = steps.getJobOrderIdFromEvent
let tagIdField = config.tagIdField
let tagIdValue = config.tagIdValue

query.where = `jobOrder.id = ${jobOrderId} AND ${tagIdField} = '${tagIdValue}'`;
query.includeDeleted = true;

done({ query });
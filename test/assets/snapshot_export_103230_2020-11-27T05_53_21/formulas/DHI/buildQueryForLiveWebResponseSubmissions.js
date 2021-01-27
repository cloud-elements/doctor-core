const query = {}
const jobOrderId = steps.getJobOrderIdFromEvent
const tagIdField = config.tagIdField
const tagIdValue = config.tagIdValue
const statusIdValue = config.statusIdValue

query.where = `jobOrder.id = ${jobOrderId} AND ${tagIdField} = '${tagIdValue}' AND status = '${statusIdValue}'`

done({ query });

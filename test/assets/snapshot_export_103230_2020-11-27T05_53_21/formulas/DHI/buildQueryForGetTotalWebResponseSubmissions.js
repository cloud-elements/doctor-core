let query = {}
let jobOrderId = steps.getJobOrderIdFromEvent
let tagIdField = config.tagIdField
let tagIdValue = config.tagIdValue
let statusIdValue = config.statusIdValue

query.where = `jobOrder.id = ${jobOrderId} AND ${tagIdField} = '${tagIdValue}' AND status = '${statusIdValue}'`

done({ query });
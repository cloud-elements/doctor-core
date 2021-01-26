let jobOrder = steps.getJobOrderByIdFromAPI.response.body
let toggleIdField = config.toggleIdField

if (jobOrder[toggleIdField] === 'On') {
  done(true)
}
else if (jobOrder[toggleIdField] === 'Off') {
  done(false)
}
else {
  done(false)
}

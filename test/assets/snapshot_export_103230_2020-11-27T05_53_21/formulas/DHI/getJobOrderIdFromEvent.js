let jobOrderId

if (trigger.event.objectType === "job-orders") {
  jobOrderId = trigger.event.objectId
} else if (trigger.event.objectType === "job-submissions") {
  const jobSubmissions = trigger.body.message.raw["job-submissions"]

  jobSubmissions.forEach(submission => {
    if (submission.id.toString() === trigger.event.objectId.toString()) {
      jobOrderId = submission.jobOrder.id;
    }
  })
}

done(jobOrderId)

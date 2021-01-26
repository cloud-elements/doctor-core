if (trigger.event.objectType === 'job-submissions') {
  done(false); 
}

let maxCandidateSubmissions = config.maxCandidateSubmissions

if (maxCandidateSubmissions > steps.getTotalWebResponseSubmissions.response.body.length) {
  done(true)
}
else {
done(false)
}
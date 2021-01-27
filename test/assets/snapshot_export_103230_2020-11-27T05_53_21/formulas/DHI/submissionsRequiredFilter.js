let maxCandidateSubmissions = config.maxCandidateSubmissions
let liveWebResponseSubmissions = steps.getLiveWebResponseSubmissions.response.headers["elements-returned-count"]

if (maxCandidateSubmissions > liveWebResponseSubmissions) {
  done(true)
}
else {
  done(false)
}

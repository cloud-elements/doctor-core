// Dice dateResumeLastUpdated
const dateResumeLastUpdated = steps.loopCandidatesForBullhornSync.entry.daysLastModified;
// Bullhorn dateLastModified
const dateLastModified = steps.getBullhornCandidateByExternalId.response.body[0].dateLastModified;

let unix_seconds = new Date(dateResumeLastUpdated).getTime();

if (unix_seconds > dateLastModified) {
  done(true);
} else {
  done(false);
}
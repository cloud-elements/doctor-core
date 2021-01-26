// Dice dateResumeLastUpdated
let dateResumeLastUpdated = steps.getUnlinkedDiceProfileById.response.body.dateLastModified;

// Bullhorn dateLastModified
let dateLastModified = steps.loopLastNameMatches.entry.dateLastModified;

// Transform Dice dateTime into Epoch seconds
let unix_seconds = new Date(dateResumeLastUpdated).getTime();

// Compare Dice and Bullhorn
if (unix_seconds > dateLastModified) {
  done(true);
} else {
  done(false);
}


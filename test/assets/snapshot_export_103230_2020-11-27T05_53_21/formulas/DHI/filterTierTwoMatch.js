const bullhornUnlinkedCandidate = steps.loopLastNameMatches.entry;
const unlinkedDiceProfile = steps.getUnlinkedDiceProfileById;

const bullhornDetails = {
  firstName: bullhornUnlinkedCandidate.firstName,
  city: bullhornUnlinkedCandidate.locations.city,
  title: bullhornUnlinkedCandidate.experience.current.title,
  company: bullhornUnlinkedCandidate.experience.current.org
}

const diceDetails = {
  firstName: unlinkedDiceProfile.firstName,
  city: unlinkedDiceProfile.locations[0].city,
  title: unlinkedDiceProfile.experience.current.title,
  company: unlinkedDiceProfile.experience.current.org
}

let match = true;

for (let i = 0; i < Object.keys(bullhornDetails).length; i++) {
  let keysList = Object.keys(bullhornDetails);
  let diceProp = diceDetails[keysList[i]];
  let bullhornProp = bullhornDetails[keysList[i]];

  if (diceProp !== bullhornProp) {
    match = false;
    break;
  }
}

done(match);
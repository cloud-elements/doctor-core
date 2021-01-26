const {org} = steps.loopOverDiceCandidateEducation.entry;
const candidateId = steps.postNewBullhornCandidate.response.body.externalId;

let educationObj = {org, candidateId};

done({ educationObj });
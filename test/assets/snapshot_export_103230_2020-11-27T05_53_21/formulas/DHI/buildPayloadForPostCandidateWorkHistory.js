let {title, org, startDate, endDate} = steps.loopOverDiceCandidateWorkHistory.entry;
let candidateId = steps.postNewBullhornCandidate.response.body.externalId;

let workHistoryObj = {title, org, startDate, candidateId};

if (endDate === null) {
  workHistoryObj["isLastJob"] = "true";
} else {
  workHistoryObj["endDate"] = endDate;
}

done({ workHistoryObj });
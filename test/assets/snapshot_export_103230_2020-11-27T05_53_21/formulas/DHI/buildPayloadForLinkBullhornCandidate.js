// Dice ID, which will be PATCHED as candidateId, which is mapped to externalId
const candidateId = steps.getUnlinkedDiceProfileById.response.body.candidateId;
let updateObj = { candidateId };
done({updateObj});
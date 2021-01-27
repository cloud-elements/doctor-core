let query = {}
let externalId = steps.loopCandidatesForBullhornSync.entry.id;
query.where = `candidateId = '${externalId}'`;

done({ query });

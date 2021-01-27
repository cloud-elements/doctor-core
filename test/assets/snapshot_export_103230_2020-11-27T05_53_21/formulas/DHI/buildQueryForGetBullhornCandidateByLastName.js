let query = {}
let lastName = steps.getUnlinkedDiceProfileById.response.body.lastName

query.where = `lastName = '${lastName}'`

done({ query });

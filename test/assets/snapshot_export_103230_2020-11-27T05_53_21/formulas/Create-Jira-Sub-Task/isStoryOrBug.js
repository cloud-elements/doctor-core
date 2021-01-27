let typeOfIssue = steps.getCreatedIssueDetails.response.body.fields.issuetype.name;

done(typeOfIssue === 'Story' || typeOfIssue === 'Bug');
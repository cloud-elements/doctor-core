// If subtasks field exists in the response 
if(steps.getCreatedIssueDetails.response.body.fields.subtasks){
  done(false);
}else{
  done(true);
}
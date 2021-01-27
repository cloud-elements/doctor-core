let response = steps.getLinkedCandidateAlreadySubmitted.response.body; 
if(response.length > 0 ) {
  done(true); 
} else {
  done(false);
}
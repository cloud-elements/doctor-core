let response = steps.getUnlinkedCandidateAlreadySubmitted.response.body; 
if(response.length > 0 ) {
  done(true); 
} else {
  done(false);
}
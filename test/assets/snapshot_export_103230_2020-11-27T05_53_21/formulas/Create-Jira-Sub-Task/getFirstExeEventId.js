function getFirstExeEventId(array, firstExeID){
  let eventID;
  
  for(let i=0; i < array.length; i++){
    if(array[i].executionid === firstExeID){
      eventID = array[i].eventId;
    }
  }
  
  return eventID;
}

done(getFirstExeEventId(config.pendingExecutions, steps.getFirstExecutionId));
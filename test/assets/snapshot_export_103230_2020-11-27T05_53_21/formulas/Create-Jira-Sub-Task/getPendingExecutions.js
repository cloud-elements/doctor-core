let pendingExecutions = [];
let index = 0;

// Get the length of formula executions response array
let lengthOfArray = steps.getFormulaInstanceExecutions.response.body.length;

for(let i=0; i<lengthOfArray; i++){
  // Get the formula execution status
  let statusOfExecution = steps.getFormulaInstanceExecutions.response.body[i].status;
  
  // If the status is in Pending, store id
  if(statusOfExecution==='pending'){
    // Creating an object to store executionid and eventid
    let executionObj = {};
    
    executionObj.executionid = steps.getFormulaInstanceExecutions.response.body[i].id;
    
    executionObj.eventId = steps.getFormulaInstanceExecutions.response.body[i].eventId;
    
    executionObj.createdDate = steps.getFormulaInstanceExecutions.response.body[i].createdDate;
    
    pendingExecutions[index] = executionObj;
    
    index++;
  }
}

// Adding pendingExecutions array & length to config object
config.pendingExecutions = pendingExecutions;
config.pendingExecutionsLength = config.pendingExecutions.length;

// Adding array to store cancel ids after comparing with current object id
config.exeIdsToCalcel = [];

done(config);
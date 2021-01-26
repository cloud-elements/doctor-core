// Get the first record from the given array
function getFirstCreatedId(array){
  array = filterExecutionIds(array);
  return array.reduce(function(id1, id2){
    let lowest;
    
    if(id1 < id2){
      lowest = id1;
    }else{
      lowest = id2;
    }
    return lowest;
  });
}

// Get only executionids from the array
function filterExecutionIds(exeArray){
  let idsArray = [];
  
  for(let i=0; i < exeArray.length; i++){
    idsArray[i] = exeArray[i].executionid;
  }
  
  return idsArray;
}

// Retrieving first created record from the array of execution ids
let firstCreatedId = getFirstCreatedId(config.pendingExecutions);

done(firstCreatedId);
// Declaring all payload properties
let subtask_payload = {};

subtask_payload.fields = {};

subtask_payload.fields.issuetype = {};

subtask_payload.fields.project = {};

subtask_payload.fields.assignee = {};

subtask_payload.fields.parent = {};

subtask_payload.fields.labels = [];

// Add properties to "issuetype" object
subtask_payload.fields.issuetype.name = "Sub-task";
subtask_payload.fields.issuetype.subtask = true;

// Add properties to the "parent" object
subtask_payload.fields.project.name = steps.getCreatedIssueDetails.response.body.fields.project.name;

subtask_payload.fields.project.key = steps.getCreatedIssueDetails.response.body.fields.project.key;

// Add properties to assignee object
let typeOfIssue = steps.getCreatedIssueDetails.response.body.fields.issuetype.name;
// Get reporter name to assign the created subtask
subtask_payload.fields.assignee.name = steps.getCreatedIssueDetails.response.body.fields.creator.name; 

//Add properties to labels array
let subtaskLabelsArray = config.subtaskLabels.split(",");

for(let i=0; i<subtaskLabelsArray.length; i++){
  subtask_payload.fields.labels[i] = subtaskLabelsArray[i].trim();
}

// Add properties to parent object
subtask_payload.fields.parent.key = steps.getCreatedIssueDetails.response.body.key;

// summary
subtask_payload.fields.summary = config.subtaskSummary;

// Add subtask_payload object to done object
done(subtask_payload);
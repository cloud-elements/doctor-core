let objectIdOfEvent = steps.getEventIdDetails.response.body.eventElementInstances[0].objectIds[0].value;

done(objectIdOfEvent === trigger.event.objectId);
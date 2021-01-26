if (request_parameters.where !== null && request_parameters.where !== undefined ){
	// storage obj for new request_parameters
	var new_params = {};
		
	// check that where include 'groupId'
	if (request_parameters.where.indexOf('groupId') > -1 ){
		
		// function for adding groupId param
		var groupHandler = function (grpExp) {
		  // extract just id value
		  var grpId = grpExp.substr(grpExp.indexOf('= ') + 2);
		  // remove '' from around id
		  grpId.replace(/'/g, "");
		  grpId = grpId.replace(/'/g, "");
		  // add groupId to new_params
		  new_params.groupId = grpId;
		}
		
		// check for multiple expressions in 'where'
		if (request_parameters.where.indexOf('AND') > -1 ) {
			// handle case of multiple expressions
			var exp_array = request_parameters.where.split(' AND ');
			// loop through expressions
		    for (var i = 0; i < exp_array.length; i++){
		      // if 'groupId' --> pass to grp handler
		      if (exp_array[i].indexOf('groupId') > -1 ) {
		      	// pass to group handler
		        groupHandler(exp_array[i]);
		        // remove from $filter
		        new_params['$filter'] = request_parameters['$filter'].split(' and ').splice(i-1, 1).join('');
		      }
		    }
		}
		// handle 'where' case with only groupId expression
		else {
			groupHandler(request_parameters.where);
	  		// check for groupId in $filter
	  		new_params['$filter'] = null;	
		}
	} else {
		new_params = request_vendor_parameters;
	}
    	
	done ({
		"request_vendor_parameters": new_params,
		"request_parameters": request_parameters,
		"continue": true
	});
	
} else {
	done({
		"continue": true
	});
}


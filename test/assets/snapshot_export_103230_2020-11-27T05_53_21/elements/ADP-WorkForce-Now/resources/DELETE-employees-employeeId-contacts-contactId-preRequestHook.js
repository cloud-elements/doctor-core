let body = request_vendor_body.replace("{employeeId}", request_path_variables.employeeId).replace("{contactId}", request_path_variables.contactId); 

done({request_vendor_body: body, continue: true});
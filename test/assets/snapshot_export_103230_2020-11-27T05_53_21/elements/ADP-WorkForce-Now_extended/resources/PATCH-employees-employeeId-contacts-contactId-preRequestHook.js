let vendorBody = request_vendor_body.replace("{employeeId}", request_path_variables.employeeId).replace("{contact}", request_body).replace("{contactId}", request_path_variables.contactId);

done({request_vendor_body: vendorBody, continue: true})
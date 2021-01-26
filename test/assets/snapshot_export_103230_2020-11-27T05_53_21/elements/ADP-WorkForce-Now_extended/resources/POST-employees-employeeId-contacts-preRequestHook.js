let vendorBody = request_vendor_body.replace("{id}", request_path_variables.employeeId).replace("{contact}", request_body);

done({request_vendor_body: vendorBody, continue: true})
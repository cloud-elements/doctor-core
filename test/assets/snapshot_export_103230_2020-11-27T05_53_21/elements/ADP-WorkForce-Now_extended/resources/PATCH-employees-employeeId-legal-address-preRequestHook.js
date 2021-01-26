let vendorBody = request_vendor_body.replace("{employeeId}", request_path_variables.employeeId).replace("{address}", request_body);

done({request_vendor_body: vendorBody, continue: true})
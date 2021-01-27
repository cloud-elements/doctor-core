let body = request_vendor_body.replace("{id}", request_path_variables.id).replace("{timestamp}", new Date(Date.now()).toISOString());

done({request_vendor_body: body, continue: true});
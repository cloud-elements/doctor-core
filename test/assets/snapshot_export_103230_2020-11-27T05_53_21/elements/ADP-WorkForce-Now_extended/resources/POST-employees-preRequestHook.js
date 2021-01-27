let body = request_vendor_body.replace("{worker}", request_body);
done({request_vendor_body: body, continue: true})
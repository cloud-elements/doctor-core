var vendor_headers = request_vendor_headers;
if(configuration ['authentication.type']=='basic'){ 
    var vendor_headers = request_vendor_headers;
    if(vendor_headers) {
		delete request_vendor_headers['X-Auth-Client'];
		delete request_vendor_headers['X-Auth-Token'];
	}
}

done({
	continue: true,
	request_vendor_headers: vendor_headers
})
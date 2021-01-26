let vendor_path = request_vendor_path;
if(configuration['store.url'].indexOf('v3') > -1){
	vendor_path = vendor_path + '/subscribers';
}
done({
	request_vendor_path: vendor_path
});
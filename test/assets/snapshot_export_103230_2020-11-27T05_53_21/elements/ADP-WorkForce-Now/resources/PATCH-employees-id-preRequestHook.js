let myBody = {"workerStatus":{"reasonCode":{"codeValue":"Existing Position","shortName":"CURR"}},"workerDates":{"rehireDate":"2012-08-12"}};
myBody.associateOID = request_path_variables.id
let finalBody = myBody
let parsed_vendor = JSON.parse(request_vendor_body)
parsed_vendor.events[0].data.transform.worker = finalBody
console.log("parsed vendor"+JSON.stringify(parsed_vendor))
done({request_vendor_body: parsed_vendor})
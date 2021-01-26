var id = request_path.replace("/hubs/crm/contacts/", "");
var new_params = {};

new_params['$filter'] = "id eq " + id;

done({
  "request_vendor_parameters": new_params,
  "continue": true  
});
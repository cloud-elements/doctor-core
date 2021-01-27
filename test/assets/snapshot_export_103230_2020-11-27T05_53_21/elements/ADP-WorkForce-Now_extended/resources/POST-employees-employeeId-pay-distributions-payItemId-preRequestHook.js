let body = request_vendor_body.replace("{employeeId}", request_path_variables.employeeId)
  .replace("{payItemId}", request_path_variables.payItemId)
  .replace("{payrollFileId}", request_parameters.payrollFileId)
  .replace("{payDistribution}", request_body);

console.log(body)
done({request_vendor_body: body, continue: true});
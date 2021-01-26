let newPath
let newHeaders = request_vendor_headers

if (request_path_variables.objectName === 'employees') {
  newPath  = '/events/hr/v1/worker.hire/meta'
  done({"request_vendor_path": newPath,
  'request_vendor_headers': {
    'Content-Type': null
    },
  continue: true})
}

if (request_path_variables.objectName === 'employeesContacts') {
  newPath  = '/events/hr/v1/worker.personal-contact.add/meta'
  done({"request_vendor_path": newPath,
  'request_vendor_headers': {
  'Content-Type': null
  },
  continue: true})
}

if (request_path_variables.objectName === 'employeesPayDistributions') {
  newPath  = '/events/payroll/v1/worker.pay-distribution.change/meta'
  done({"request_vendor_path": newPath,
  'request_vendor_headers': {
  'Content-Type': null
  },
  continue: true})
}
if (request_path_variables.objectName === 'employeesAddress') {
  newPath  = '/events/hr/v1/worker.legal-address.add/meta'
  done({"request_vendor_path": newPath,
  'request_vendor_headers': {
  'Content-Type': null
  },
  continue: true})
}

else {
  done({continue: false})
}
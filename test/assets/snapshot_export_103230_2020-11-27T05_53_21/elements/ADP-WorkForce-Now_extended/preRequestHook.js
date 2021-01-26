if (object_name === 'employees' && request_method == 'GET') {
    done({
        'request_vendor_headers': {
            'Accept': null,
            'Content-Type': null
        }
    });
} else if (object_name === 'employeesContacts' || object_name === 'employeesPayDistributions' && request_method == 'GET') {
    done({
        'request_vendor_headers': {
            'Content-Type': null
        }
    });
}
 else {
    done();
}
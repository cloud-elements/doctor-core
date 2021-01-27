# doctor-core
The doctor-core holds the core functionality of Doctor tool (The Cloud Elements Asset Management Tool) which will be used internally by [doctor-cli](https://github.com/CloudElementsOpenLabs/the-doctor) package and [doctor-service](https://github.com/cloud-elements/doctor-service) as their dependencies

### doctor-core unit tests
Run all the unit test cases via the following command
```
$ npm run test:unit
```

> __PROTIP:__ `node` version must  be >= `v12.18.3`

Run a single unit test file via the following command
```
$ jest getExtendedElements.test.js
```
Run all the unit test cases with coverage and view the code coverage report via the following command
```
$ npm run test:unit:coverage
```

#### Important notes
1. Debug and console.logs in doctor-core are disabled by default. To enable them, the `ENABLE_DEBUG_LOG` environment variable must be set to true (true for CLI by default).
2. Some of the features won't work if you are not following the node version specified in the package.json file.

#### Steps to link local doctor-core project as a dependency in doctor-cli or doctor-service
```
cd <path/to/doctor-core>                 # go into the doctor-core project directory
npm link                                 # creates global link
cd <path/to/doctor-service/doctor-app>   # go into some other project directory.
npm link @cloudelements/doctor-core      # link-install the package
```

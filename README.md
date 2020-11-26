# doctor-core
The doctor-core holds the core functionality of Doctor tool (The Cloud Elements Asset Management Tool) which will be used internally by [doctor-cli](https://github.com/CloudElementsOpenLabs/the-doctor) package and [doctor-service](https://github.com/cloud-elements/doctor-service) as their dependencies

## Steps to link local doctor-core project as a dependency of doctor-cli or doctor-service
```
cd <path/to/doctor-core>                 # go into the doctor-core project directory
npm link                                 # creates global link
cd <path/to/doctor-service/doctor-app>   # go into some other project directory.
npm link @cloudelements/doctor-core      # link-install the package
```

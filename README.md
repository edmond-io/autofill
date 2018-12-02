# Auto Fill OrangeHRM Timesheet
This tool helps you **auto-fill** ~~annonying~~ **timesheet** in orangeHRM.
It supports searching project and activity by name.
Most importantly, it fills **public holiday** for you.


## Demo
https://qcom.herokuapp.com/


## Target version
- node: "10.12.0"
- npm: "6.4.1"
- orangeHRM: "2.6.0.2"


## Steps to publish (local)
1. Create your local .env from .env.sample
- update the HRM_HOST to your hosted orangehrm

2. run npm install

3. Go to browser: http://localhost:8282


## Postman API docs
This app is a wrapper of the postman collection of web requests.
Here gives you the brief idea about the web requests defined in postman/AUF.postman_collection.json
https://documenter.getpostman.com/view/5919958/RzfdrAzV

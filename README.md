# Auto Fill OrangeHRM Timesheet
This tool helps you **auto-fill** ~~annonying~~ **timesheet** in orangeHRM.
It supports searching project and activity by name.
Most importantly, it fills **public holiday** for you.


## Demo
https://qcom.herokuapp.com/

![Demo Video](https://edmond-io.github.io/autofill/docs/sample_fill.gif)


## Target version
- node: "10.12.0"
- npm: "6.4.1"

## Steps to publish (local dev)
1. Create your local .env from .env.sample
- update port if you don't like the default 8282
- update the HRM_HOST to your company's orangehrm address

2. Install node modules
- run `npm install`

3. Run the app
- run `npm run dev`

4. Go to browser: http://localhost:8282


## Postman API docs
This app is a wrapper of the postman collection of web requests.
Here gives you the brief idea about the web requests defined in postman/AUF.postman_collection.json
https://documenter.getpostman.com/view/5919958/RzfdrAzV

#### Debugging the postman collection
You can import the json files in postman folder to the Postman App (e.g. Chrome Extension/ Program).

The flow of the requests should be:
1. Login
2. Validate Project
3. Validate Activities
4. HK Holiday
5. Fetch Next Timesheet
6. Update Timesheet
7. Submit Timesheet
8. Verify Timesheet
9. Logout


## About OrangeHRM version
This auto-fill tool is developed based on version 2.6.0.2.
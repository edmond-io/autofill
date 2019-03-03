let express = require('express')
let router = express.Router();
let newman = require('newman');

// load environment variables
require('dotenv').config();

// prepare newman config
let envObj = {
    "values": [
        {
            "key": "user",
        },
        {
            "key": "session",
        },
        {
            "key": "month",
        },
        {
            "key": "activity",
        },
        {
            "key": "project",
        },
        {
            "key": "HRM_HOST",
            "value": process.env.HRM_HOST
        }
    ]
};


function runNewman(userName) {
    let reporters = ["console"];

    return newman.run({
        collection: require('../postman/AUF.postman_collection.json'),
        reporters: reporters,
        reporter: {
            "console": {
                userName: userName
            }
        },
        environment: envObj,
        // abortOnError: true, // check syntax
        // abortOnFailure: false // let the scripts logout

    }).on('start', function (err, args){
        send('running the script...', userName);

    }).on('assertion', function (err, args) {
        let requestId = args.item.name,
            message = args.assertion,
            isPass = args.error === null;


        if (isHTML(message)) {
            sendHTML(message, userName);
            return;
        }

        // customize message
        switch (requestId) {
            case 'Validate_Activity':
                if (message.indexOf(">> ") >= 0) {
                    let activity = message.slice(3);
                    message = `>> <a data-activity='${activity}' href="#">${activity}</a>`;
                }
                break;

            case 'Validate_Project':
                if (message.indexOf(">> ") >= 0) {
                    let projName = message.slice(3);
                    message = `>> <a data-project='${projName}' href="#">${projName}</a>`;
                }
                break;

        }


        if (isPass)
            send(`[${requestId}] ${message}`, userName);
        else
            sendErr(`[${requestId}] ${message}`, userName);

    }).on('done', function (err, summary){
        if (summary.error) {
            if (process.env.NODE_ENV === 'development') {
                err.stack.split(" at").forEach((line) => {
                    sendErr(`at ${line}`, userName);
                })
            } else
                sendErr(summary.error.name);

            return;
        }

        let runStatus = summary.environment.values.filter(obj => obj.key === "STATUS").map(obj => obj.value).pop();
        if (runStatus) {
            try {
                runStatus = JSON.parse(runStatus);
                let obj = (process.env.NODE_ENV === 'development') ? runStatus : runStatus.msg;
                toast(obj, userName);
            } catch (err) {
                sendErr(`Err: ${runStatus}`, userName);
            }


        }
        send(`Completed in ${summary.run.timings.completed - summary.run.timings.started} ms.`, userName);
    });
}

function isHTML(assertion) {
    return assertion.startsWith("<!DOCTYPE");
}


router.post('/', function (req, res) {
    if (!req.body.user || !req.body.session || !req.body.month) {
        res.send("Not OK.");
        return;
    }

    envObj.values[0].value = req.body.user;
    envObj.values[1].value = req.body.session;
    envObj.values[2].value = req.body.month;
    envObj.values[3].value = req.body.activity;
    envObj.values[4].value = req.body.project;

    runNewman(req.body.user);
    res.send("OK")
});


module.exports = router;
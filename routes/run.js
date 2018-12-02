let express = require('express')
let router = express.Router();
let newman = require('newman');
let atob = require('atob');

// load environment variables
require('dotenv').config();

// prepare newman config
let envObj = {
    "values": [
        {
            "key": "user",
        },
        {
            "key": "nSession",
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
    return newman.run({
        collection: require('../postman/AUF.postman_collection.json'),
        reporters: [
            "console"
        ],
        reporter: {
            "console": {
                userName: userName
            }
        },
        environment: envObj
    }).on('start', function (err, args){
        send('running the script...', userName);

    }).on('done', function (err, summary){
        if (err || summary.error) {
            sendErr('collection run encountered an error.' + err, userName);
            return;
        }

        send(`Completed in ${summary.run.timings.completed - summary.run.timings.started} ms.`, userName);
    });
}


router.post('/', function (req, res) {
    if (!req.body.user || !req.body.session || !req.body.month) {
        res.send("Not OK.");
        return;
    }

    let newmanSession = atob(req.body.session)
    envObj.values[0].value = req.body.user;
    envObj.values[1].value = newmanSession;
    envObj.values[2].value = req.body.month;
    envObj.values[3].value = req.body.activity;
    envObj.values[4].value = req.body.project;

    runNewman(req.body.user);
    res.send("OK")
});


module.exports = router;
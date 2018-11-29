var express = require('express')
var router = express.Router();
var newman = require('newman');


// prepare newman config
var envObj = {
    "values": [
        {
            "key": "user",
        },
        {
            "key": "pw",
        },
        {
            "key": "month",
        },
        {
            "key": "activity",
        },
        {
            "key": "project",
        }
    ]
};


function runNewman(userName) {
    return newman.run({
        collection: require('./AUF.postman_collection.json'),
        reporters: [
            "console"
            , "cli"
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
            sendErr('collection run encountered an error.', userName);
        }
        else {
            send('script completed.', userName);
        }
    });
}


router.post('/run', function(req, res){
    envObj.values[0].value = req.body.user
    envObj.values[1].value = req.body.pw
    envObj.values[2].value = req.body.month
    envObj.values[3].value = req.body.activity
    envObj.values[4].value = req.body.project


    runNewman(req.body.user)
    res.send("OK")
});


module.exports = router;
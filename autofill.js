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


function runNewman(){
    return newman.run({
        collection: require('./AUF.postman_collection.json'),
        reporters: [
            "console"
            , "cli"
        ],
        environment: envObj
    }).on('start', function (err, args){
        console.log('running the script...');

    }).on('done', function (err, summary){
        if (err || summary.error) {
            console.error('collection run encountered an error.');
        }
        else {
            console.log('script completed.');
        }
    });
}


router.post('/run', function(req, res){
    envObj.values[0].value = req.body.user
    envObj.values[1].value = req.body.pw
    envObj.values[2].value = req.body.month
    envObj.values[3].value = req.body.activity
    envObj.values[4].value = req.body.project
    runNewman()
    res.send("OK")
});


module.exports = router;
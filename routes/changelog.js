const express = require('express')
const router = express.Router();
const path = require('path');
const fs = require('fs');
const marked = require('marked');


function renderChangeLog(req, res) {
    let md = path.join(__dirname, '../CHANGELOG.md');
    fs.readFile(md, 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        }

        let version = data.match(/\[(.*?)\]/);
        console.log("Version: " + version[0]);

        if (data && version) {
            res.json({
                success: true,
                data: marked(data.toString()),
                version: version[1]
            });
        } else {
            res.json({
                success: false,
                data: "Error in fetching"
            })
        }
    });
}


router.get('/', renderChangeLog);

module.exports = router;
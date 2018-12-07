const express = require('express');
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

        // show first 5 changes only
        data = firstNthSection("\\s##\\s", data, 5);

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

/**
 *
 * @param regex String representation of RegExp
 * @param str Datastring
 * @param n number of times
 * @returns {*} First n-th section from datastring
 */
function firstNthSection(regex, str, n = 1) {
    let count = 0,
        re = new RegExp(regex, "gm");

    while ((match = re.exec(str)) != null) {
        count++;

        if (count >= n + 1)
            return str.slice(0, match.index);
    }
    return str;
}

router.get('/', renderChangeLog);

module.exports = router;
// var exportFile = require('./rollingExport');

function isTrue(bool) {
    return bool && ((typeof(bool) === "boolean" && bool) || bool === 'true');
}

module.exports = function(newman, reporterOptions) {
    var basicOutput = '';
    typeof(variable) === "boolean"
    // var useCli = isTrue(reporterOptions.cli);
    // var useRolling = isTrue(reporterOptions.rolling);
    // var useExport = reporterOptions.export && typeof reporterOptions.export === 'string';
    // var newmanCollection = reporterOptions.collection;

    // function log(str) {
    //     if (useRolling || useExport) basicOutput += str;
    //     if (useCli) process.stdout.write(str);
    // }

    // Add time length for all tests
    newman.on('start', function () {
        console.log("Start collection run");
        this.count = 1;
    });

    // newman.on('beforeItem', (err, o) => { });

    // newman.on('beforeRequest', (err, o) => { });

    newman.on('request', function(err, o){
        if (err) {
            // console.log(JSON.stringify(err));
        }
        if (o) {
            // console.log(JSON.stringify(o));
        }
    });

    newman.on('script', function (err, o){
        // console.log(JSON.stringify(o));
    });

    newman.on('assertion', function (err, o){
        // if (this.count == 1)
            // console.log('URL PATH: ' + o.item.request.url.path.join('/'));

        if (err) {
            // var responses = JSON.parse(JSON.stringify(o.item.responses));
            logRed("["+o.item.name + "]: " + o.assertion);

            // if (responses && responses.length > 0) {
            //     console.log('CODE: ' + responses[0].code + '\n');
            //     console.log('BODY: ' + responses[0].body + '\n');
            // }
        } else {
            console.log("[" + o.item.name + "]: " + o.assertion );
        }

        this.count++;
    });

    newman.on('beforeDone', function(err) {
        if (err) {
            logRed('there was an error');
            return;
        }

        console.log("Collection run completed for collection.");

        // Export to a single file based on rolling option
        // var options = {
        //     name: 'basic-reporter',
        //     path: reporterOptions.export,
        //     content: basicOutput
        // };

        // newman.exports.push(options);
    });
};
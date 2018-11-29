module.exports = function(newman, reporterOptions) {
    typeof(variable) === "boolean"
    var userName = reporterOptions.userName;

    // Add time length for all tests
    newman.on('start', function () {
        send("Start collection run", userName);
        this.count = 1;
    });

    // newman.on('beforeItem', (err, o) => { });

    // newman.on('beforeRequest', (err, o) => { });

    newman.on('request', function(err, o){
        if (err) {
            // send(JSON.stringify(err));
        }
        if (o) {
            // send(JSON.stringify(o));
        }
    });

    newman.on('script', function (err, o){
        // send(JSON.stringify(o));
    });

    newman.on('assertion', function (err, o){
        // if (this.count == 1)
        // send('URL PATH: ' + o.item.request.url.path.join('/'));

        if (err) {
            // var responses = JSON.parse(JSON.stringify(o.item.responses));
            sendErr("[" + o.item.name + "]: " + o.assertion, userName);

            // if (responses && responses.length > 0) {
            //     send('CODE: ' + responses[0].code + '\n');
            //     send('BODY: ' + responses[0].body + '\n');
            // }
        } else {
            send("[" + o.item.name + "]: " + o.assertion, userName);

        }

        this.count++;
    });

    newman.on('beforeDone', function(err) {
        if (err) {
            sendErr('there was an error', userName);
            return;
        }

        send("Collection run completed for collection.", userName);

        // Export to a single file based on rolling option
        // var options = {
        //     name: 'basic-reporter',
        //     path: reporterOptions.export,
        //     content: basicOutput
        // };

        // newman.exports.push(options);
    });
};
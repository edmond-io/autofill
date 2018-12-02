module.exports = function(newman, reporterOptions) {
    let userName = reporterOptions.userName;

    // Add time length for all tests
    newman.on('start', function () {
        send("Start collection run.", userName);
        this.assertionCount = 1;
    });

    // newman.on('beforeItem', (err, o) => { });

    // newman.on('beforeRequest', (err, o) => { });

    newman.on('request', function(err, o){
        send(`URL PATH: /${o.item.request.url.path.join('/')}`, userName);
    });

    // newman.on('script', (err, o) => {} );

    newman.on('assertion', (err, o) => {
        if (err) {
            sendErr(`[${o.item.name}]: ${o.assertion}`, userName);

        } else {
            send(`[${o.item.name}]: ${o.assertion}`, userName);

        }

        this.assertionCount++;
    });

    newman.on('beforeDone', function(err) {
        if (err) {
            sendErr('there was an error: ' + JSON.stringify(err), userName);
            return;
        }

    });
};
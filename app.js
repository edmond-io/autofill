var express = require('express');
var autofill = require('./autofill');
var port = process.env.PORT || 8282;
var app = express();
var server = require('http').Server(app)
var io = require('socket.io')(server)

var events = require('events');
var eventEmitter = new events.EventEmitter();


app.use(express.json());
app.use(express.urlencoded({ extended: true}))
app.use('/', autofill);
//


server.listen(port, function(){
    console.log("Listening on *:" + port);
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log("Connected WS.");
    socket.on('my other event', function (data) {
        console.log(data);
    });
});

eventEmitter.on('logging', function(message, clz) {
    io.emit('log_message', {
        data: message,
        class: clz
    });
});


// Override console.log
var originConsoleLog = console.log;
console.log = function(data) {
    eventEmitter.emit('logging', data);
    originConsoleLog(data);
};

var originConsoleErr = console.error;
console.error = function(data) {
    eventEmitter.emit('logging', data);
    originConsoleErr(data);
};


logRed = function(data){
    eventEmitter.emit('logging', data, "red-text");
    originConsoleErr(data);
};
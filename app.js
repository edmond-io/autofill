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


server.listen(port, function(){
    console.log("Listening on *:" + port);
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

/*
Array to store the list of users along with there respective socket id.
*/
var users = [];

io.on('connection', function (socket) {

    socket.emit("log_message", {data: "Connected WS. Welcome.", class: "grey-text"});
    socket.emit("log_message", {data: "This tool helps you auto-fill annonying timesheet in orangeHRM."});
    socket.emit("log_message", {data: "It supports searching project and activity by name."});
    socket.emit("log_message", {data: "Most importantly, it fills public holiday for you."});
    socket.emit("log_message", {data: "Medical leaves are coming soon... Stay tuned!"});
    socket.emit("log_message", {data: "Just enter your user name and password to start. :)", class: "teal-text"});

    socket.on('user', function (userName) {
        users.push({
            id: socket.id,
            user: userName
        });

        eventEmitter.emit('logging', userName + " joined the party.", "blue-text");

    });

    socket.on('disconnect', function () {

        for (var i = 0; i < users.length; i++) {

            if (users[i].id === socket.id) {
                users.splice(i, 1);
                console.log(users[i].user + " left.")
            }
        }
    });
});

eventEmitter.on('logging', function (message, clz, user) {
    if (user) {
        var socketId;
        for (var i = 0; i < users.length; i++) {
            if (users[i].user === user) {
                socketId = users[i].id
            }
        }

        io.to(socketId).emit('log_message', {
            data: message,
            class: clz
        });

    } else {
        io.emit('log_message', {
            data: message,
            class: clz
        });
    }
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

send = function (data, userName) {
    eventEmitter.emit('logging', data, null, userName);
    originConsoleLog(data);
}

sendErr = function (data, userName) {
    eventEmitter.emit('logging', data, "red-text", userName);
    originConsoleErr(data);
};

const express = require('express');
const path = require('path');
const serveIndex = require('serve-index')
const app = express();


let index = require('./routes/index');
let autofill = require('./routes/run');
let changelog = require('./routes/changelog');

// set up for socket io
const server = require('http').Server(app)
const io = require('socket.io')(server)

// set up for WS event emitter
const events = require('events');
const eventEmitter = new events.EventEmitter();

// load environment variables
require('dotenv').config();

// View Engine
// app.set('views', path.join(__dirname, 'client'));
app.set('views', '/');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// Set static Folder


// MW
app.use(express.json());
app.use(express.urlencoded({ extended: true}))
server.listen(process.env.PORT, function () {
    console.log("Listening on *:" + process.env.PORT);
});


// routes
app.use(express.static(path.join(__dirname, 'client')));
app.get('/healthcheck', (req, res) => res.send("OK"));
app.use('/', index);
app.use('/run', autofill);
app.use('/changelog', changelog);
app.use('/history', serveIndex(path.join(__dirname, 'newman')));
app.use('/history', express.static(path.join(__dirname, 'newman')));
app.use('/static', express.static(path.join(__dirname, 'client')));


/*
Array to store the list of users along with there respective socket id.
*/
const users = [];

io.on('connection', function (socket) {

    socket.emit("log_message", {data: "Connected WS. Welcome.", class: "grey-text"});
    socket.emit("log_message", {data: "Just enter your user name and password to start. :)", class: "teal-text"});
    socket.emit("log_message", {data: "Medical leaves are coming soon... Stay tuned!"});

    socket.on('user', function (userName) {
        users.push({
            id: socket.id,
            user: userName
        });

        eventEmitter.emit('logging', userName + " joined the party.", "blue-text");

    });

    socket.on('disconnect', function () {

        for (let i = 0; i < users.length; i++) {

            if (users[i].id === socket.id) {
                send(users[i].user + " left.")
                users.splice(i, 1);
            }
        }
    });
});

eventEmitter.on('logging', function (action, message, clz, user) {
    if (user) {
        let socketId;
        for (let i = 0; i < users.length; i++) {
            if (users[i].user === user) {
                socketId = users[i].id
            }
        }

        io.to(socketId).emit(action, {
            data: message,
            class: clz
        });

    } else {
        io.emit(action, {
            data: message,
            class: clz
        });
    }
});


// Exception handling
app.all('*', function (req, res) {
    console.log("[TRACE] Server 404 request: " + req.originalUrl);
    res.redirect("/")
});


originConsoleLog = console.log;
originConsoleErr = console.error;

if (process.env.NODE_ENV === 'development') {

    // Override console.log
    console.log = function (data) {
        eventEmitter.emit('logging', "DEV: " + data, "grey-text text-lighten-1");
        originConsoleLog(data);
    };

    console.error = function (data) {
        eventEmitter.emit('logging', data);
        originConsoleErr(data);
    };
}

send = function (data, userName, clazz) {
    eventEmitter.emit('logging', 'log_message', data, clazz, userName);
    if (process.env.NODE_ENV === 'development') originConsoleLog(data);
};

sendErr = function (data, userName, clazz) {
    eventEmitter.emit('logging', 'log_message', data, "red-text " + clazz, userName);
    originConsoleErr(data);
};

toast = function (data, userName, clazz) {
    eventEmitter.emit('logging', 'toast', data, clazz, userName);
    if (process.env.NODE_ENV === 'development') originConsoleLog("TOAST: " + data);
};
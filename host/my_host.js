#!/usr/local/bin/node

// Might be good to use an explicit path to node on the shebang line in case
// it isn't in PATH when launched by Chrome.

var fs = require('fs');
var net = require("net");
const client = net.connect(3000);

// var nativeMessage = require('../nativeMessage');

// var input = new nativeMessage.Input();
// var transform = new nativeMessage.Transform(messageHandler);
// var output = new nativeMessage.Output();

process.stdin
    // .pipe(input)
    // .pipe(transform)
    .pipe(client)
    .pipe(process.stdout)
;

// var subscriptions = {};

// var timer = setInterval(function() {
//     if (subscriptions.time) {
//         output.write({ time: new Date().toISOString() });
//     }
// }, 1000);

// input.on('end', function() {
//     clearInterval(timer);
// });

// function messageHandler(msg, push, done) {
//     if (msg.readdir) {
//         fs.readdir(msg.readdir, function(err, files) {
//             if (err) {
//                 push({ error: err.message || err });
//             } else {
//                 files.forEach(function(file) {
//                     push({ file: file });
//                 });
//             }

//             done();
//         });
//     } else if (msg.subscribe) {
//         subscriptions[msg.subscribe] = true;
//         push({ subscribed: msg.subscribe });
//         done();
//     } else if (msg.unsubscribe) {
//         delete subscriptions[msg.unsubscribe];
//         push({ unsubscribed: msg.unsubscribe });
//         done();
//     } else {
//         // Just echo the message:
//         push(msg);
//         done();
//     }
// }
// var net = require("net");
// var fs = require('fs');

// var nativeMessage = require('../nativeMessage');

// var input = new nativeMessage.Input();
// var transform = new nativeMessage.Transform(messageHandler);
// var output = new nativeMessage.Output();

// process.stdin
//     .pipe(input)
//     .pipe(transform)
//     .pipe(output)
//     .pipe(process.stdout)
// ;
// const client = net.connect(3000);

// // process.stdin.pipe(net.connect(port)).pipe(process.stdout);
// // Handle incoming data from the server
// client.on('data', function (data) {
//     console.log(data)
//     process.stdout.pipe.write("1")
//     // process.stdout.write(data);
// });

// // Pipe input from stdin to the server
// // process.stdin.pipe(input).pipe(transform).pipe(client);

// // Handle error events
// client.on('error', function (err) {
//     console.error('Error:', err);
// });
// Might be good to use an explicit path to node on the shebang line in case
// it isn't in PATH when launched by Chrome.
/*
var fs = require('fs');

var nativeMessage = require('../nativeMessage');

var input = new nativeMessage.Input();
var transform = new nativeMessage.Transform(messageHandler);
var output = new nativeMessage.Output();

process.stdin
    .pipe(input)
    .pipe(transform)
    .pipe(output)
    .pipe(process.stdout)
;

var subscriptions = {};

var timer = setInterval(function() {
    if (subscriptions.time) {
        output.write({ time: new Date().toISOString() });
    }
}, 1000);

input.on('end', function() {
    clearInterval(timer);
});

function messageHandler(msg, push, done) {
    console.log(msg);
    if (msg.readdir) {
        fs.readdir(msg.readdir, function(err, files) {
            if (err) {
                push({ error: err.message || err });
            } else {
                files.forEach(function(file) {
                    push({ file: file });
                });
            }

            done();
        });
    } else if (msg.subscribe) {
        subscriptions[msg.subscribe] = true;
        push({ subscribed: msg.subscribe });
        done();
    } else if (msg.unsubscribe) {
        delete subscriptions[msg.unsubscribe];
        push({ unsubscribed: msg.unsubscribe });
        done();
    } else {
        // Just echo the message:
        push(msg);
        done();
    }
}*/
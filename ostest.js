#!/usr/bin/env node

/*
 * Linux        ->   22 -> green
 * Windows 8    ->  135 -> blue
 * Windows 7    -> 3389 -> cyan
 * Server       -> 1022 -> magenta
 * Camera       ->  554 -> yellow
 * Unresponsive -> ???? -> red
*/

var fs = require('fs'),
    net = require('net'),
    async = require('async'),
    colors = require('colors');

var ports = [22, 135, 3389, 1022, 554];

function portProbe(port, host, timeout, callback) {
    var socket = new net.Socket(),
        status = null,
        error = null

    socket.setTimeout(timeout)

    socket.on('connect', function () {
        status = 'open'
        socket.destroy()
    })

    socket.on('timeout', function () {
        status = 'closed'
        socket.destroy()
    })

    socket.on('error', function(exception) {
        error = exception
        status = 'closed'
    })

    socket.on('close', function () {
        callback(error, status)
    })

    socket.connect(port, host)
}

var port = 22,
    hostname = "cf405-02",
    timeout = 100;

portProbe(port, hostname, timeout, function(error, status) {
    if (status == 'closed') {
        console.log(hostname.red);
    } else {
        switch(port) {
            case 22:
                console.log(hostname.green);
                break;
            case 135:
                console.log(hostname.blue);
                break;
            case 3389:
                console.log(hostname.cyan);
                break;
            case 1022:
                console.log(hostname.magenta);
                break;
            case 554:
                console.log(hostname.yellow);
                break;
            default:
                console.log(hostname.red);
        }
    }
    if (error) console.error(error);
})

//fs.readFile('./cf414', 'utf8', function(err, data) {
//    if (err) throw err;
//    //console.log(data);
//    var array = data.toString().split("\n");
//    for (i in array) {
//        portProbe(22, array[i], 1000);
//    }
//});

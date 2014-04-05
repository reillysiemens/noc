#!/usr/bin/env node

/*
 * Linux     ->   22
 * Windows 8 ->  135
 * Windows 7 -> 3389
 * Server    -> 1022
 * Camera    ->  554
*/

var fs = require('fs');
var net = require('net');
var colors = require('colors');

var ports = [22, 135, 3389, 1022, 554];

function portProbe(port, host, timeout, callback) {
    var socket = new net.Socket(),
        status = null

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
        if (status == 'closed') {
            console.log(host.red);
            //console.log(host + " is down");
        } else {
            switch(port) {
                case 22:
                    console.log(host.green);
                    //console.log(host + " is in linux");
                    break;
                case 135:
                    console.log(host.blue);
                    //console.log(host + " is in windows 8");
                    break;
                case 3389:
                    console.log(host.cyan);
                    //console.log(host + " is in windows 7");
                    break;
                case 1022:
                    console.log(host.magenta);
                    //console.log(host + " is a server");
                    break;
                case 554:
                    console.log(host.yellow);
                    //console.log(host + " is a camera");
                    break;
                default:
                    console.log(host.red);
                    //console.log(host + " is not real");
            }
        }
    })

    socket.connect(port, host)
}

var hostname = "cf414-02",
    timeout = 100;

//portProbe(22, hostname, timeout);
//portProbe(135, hostname, timeout);
//portProbe(3389, hostname, timeout);
//portProbe(1022, hostname, timeout);
//portProbe(554, hostname, timeout);

//fs.readFile('./cf414', 'utf8', function(err, data) {
//    if (err) throw err;
//    //console.log(data);
//    var array = data.toString().split("\n");
//    for (i in array) {
//        portProbe(22, array[i], 1000);
//    }
//});

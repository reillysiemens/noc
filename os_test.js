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

//var ports = [22, 135, 3389, 1022, 554];

function portProbe(port, host, timeout) {
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

    socket.on('close', function() {
        if (status == 'open') {
            console.log(host.green + ':'.green + port.toString().green + ' is open.'.green);
        } else {
            console.log(host.red + ':'.red + port.toString().red + ' is closed.'.red);
        }
    })

    socket.connect(port, host)
}

var hostname = "linux-02",
    timeout = 100;

portProbe(22, hostname, timeout);
portProbe(135, hostname, timeout);
portProbe(3389, hostname, timeout);
portProbe(1022, hostname, timeout);
portProbe(554, hostname, timeout);

//fs.readFile('./cf414', 'utf8', function(err, data) {
//    if (err) throw err;
//    //console.log(data);
//    var array = data.toString().split("\n");
//    for (i in array) {
//        portProbe(22, array[i], 1000);
//    }
//});

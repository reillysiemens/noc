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

function osTest(ports, host, timeout, callback) {
    var foundPort = false
    var numberOfPortsChecked = 0
    var portIndex = 0
    var port = ports[portIndex]

    if (host == '') { return };

    var hasFoundPort = function () {
        return foundPort || numberOfPortsChecked === (ports.length - 1)
    }

    var checkNextPort = function(callback) {
        portProbe(port, host, timeout, function(error, statusOfPort) {
            numberOfPortsChecked++
            if (statusOfPort === 'open') {
                foundPort = true
                callback(error)
            } else {
                portIndex++
                port = ports[portIndex]
                callback(null)
            }
        })
    }

    async.until(hasFoundPort, checkNextPort, function(error) {
        if (error) {
            callback(error, port)
        } else if (foundPort) {
            callback(null, port)
        } else {
            callback(null, false)
        }
    })
}

fs.readFile(process.argv[2], 'utf8', function(err, data) {
    if (err) throw err;
    var hosts = data.toString().split("\n");
    hosts.forEach(function(host) {
        osTest(ports, host, 40, function(error, port) {
            if (port == false) {
                console.log(host.red);
            } else {
                switch(port) {
                    case 22:
                        console.log(host.green);
                        break;
                    case 135:
                        console.log(host.blue);
                        break;
                    case 3389:
                        console.log(host.cyan);
                        break;
                    case 1022:
                        console.log(host.magenta);
                        break;
                    case 554:
                        console.log(host.yellow);
                        break;
                    default:
                        console.log(host.red);
                }
            }
            //console.log('Found an open port at ' + port)
            //if (error) console.error(error);
        })
    })
});

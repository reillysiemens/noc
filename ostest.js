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
            callback(error, {port: port, host: host})
        } else if (foundPort) {
            callback(null, {port: port, host: host})
        } else {
            callback(null, {port: false, host: host})
        }
    })
}

fs.readFile(process.argv[2], 'utf8', function(err, data) {
    if (err) throw err;
    var hosts = data.toString().split("\n");
    hosts.forEach(function(host) {
        osTest(ports, host, 40, function(error, result) {
            if (result.port == false) {
                console.log(result.host.red);
            } else {
                switch(result.port) {
                    case 22:
                        console.log(result.host.green);
                        break;
                    case 135:
                        console.log(result.host.blue);
                        break;
                    case 3389:
                        console.log(result.host.cyan);
                        break;
                    case 1022:
                        console.log(result.host.magenta);
                        break;
                    case 554:
                        console.log(result.host.yellow);
                        break;
                    default:
                        console.log(result.host.red);
                }
            }
            //console.log('Found an open port at ' + port)
            //if (error) console.error(error);
        })
    })
});

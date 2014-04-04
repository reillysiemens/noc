#!/usr/bin/env node

/*
 * Linux 22
 * Windows8 135
 * Windows7 3389
 * Server 1022
 * Camera 554
*/

var net = require('net');
var colors = require('colors');

function portProbe(port, host) {
    socket = new net.Socket();

    socket.

    //if (socket.connect(port, host)) {
    //    console.log(host + ": " + "Windows 8".magenta);
    //} else {
    //    console.log("Could not establish a connection to the remote host.".red);
    //}

    //socket.destroy();
}

portProbe(135, "cf164-08");

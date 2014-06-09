
/*
Linux        ->   22 -> green
Windows 8    ->  135 -> blue
Windows 7    -> 3389 -> cyan
Server       -> 1022 -> magenta
Camera       ->  554 -> yellow
Unresponsive -> ???? -> red
 */

(function() {
  var async, chalk, fs, net, osTest, portProbe, ports, processHost, timeout;

  fs = require('fs');

  net = require('net');

  async = require('async');

  chalk = require('chalk');

  ports = [22, 135, 3389, 1022, 554];

  timeout = 40;

  portProbe = function(port, host, timeout, callback) {
    var error, socket, status;
    socket = new net.Socket();
    status = null;
    error = null;
    socket.setTimeout(timeout);
    socket.on('connect', function() {
      status = 'open';
      return socket.destroy();
    });
    socket.on('timeout', function() {
      status = 'closed';
      return socket.destroy();
    });
    socket.on('error', function(exception) {
      error = exception;
      return status = 'closed';
    });
    socket.on('close', function() {
      return callback(error, status);
    });
    return socket.connect(port, host);
  };

  osTest = function(ports, host, timeout, callback) {
    var checkNextPort, foundPort, hasFoundPort, numberOfPortsChecked, port, portIndex;
    foundPort = false;
    numberOfPortsChecked = 0;
    portIndex = 0;
    port = ports[portIndex];
    if (host === '') {
      return;
    }
    hasFoundPort = function() {
      return foundPort || numberOfPortsChecked === (ports.length - 1);
    };
    checkNextPort = function(callback) {
      return portProbe(port, host, timeout, function(error, statusOfPort) {
        numberOfPortsChecked++;
        if (statusOfPort === 'open') {
          foundPort = true;
          return callback(error);
        } else {
          portIndex++;
          port = ports[portIndex];
          return callback(null);
        }
      });
    };
    return async.until(hasFoundPort, checkNextPort, function(error) {
      if (error) {
        return callback(error, port);
      } else if (foundPort) {
        return callback(null, port);
      } else {
        return callback(null, false);
      }
    });
  };

  processHost = function(host) {
    return osTest(ports, host, timeout, function(error, port) {
      if (port === false) {
        return console.log(chalk.red(host));
      } else {
        switch (port) {
          case 22:
            return console.log(chalk.green(host));
          case 135:
            return console.log(chalk.blue(host));
          case 3389:
            return console.log(chalk.cyan(host));
          case 1022:
            return console.log(chalk.magenta(host));
          case 554:
            return console.log(chalk.yellow(host));
          default:
            return console.log(chalk.red(host));
        }
      }
    });
  };

  fs.readFile(process.argv[2], 'utf-8', function(err, data) {
    var host, hosts, _i, _len, _results;
    if (err) {
      throw err;
    }
    hosts = data.toString().split('\n');
    _results = [];
    for (_i = 0, _len = hosts.length; _i < _len; _i++) {
      host = hosts[_i];
      _results.push(processHost(host));
    }
    return _results;
  });

}).call(this);

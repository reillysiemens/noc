#!/usr/bin/env coffee

###
Linux        ->   22 -> green
Windows 8    ->  135 -> blue
Windows 7    -> 3389 -> cyan
Server       -> 1022 -> magenta
Camera       ->  554 -> yellow
Unresponsive -> ???? -> red
###

fs = require 'fs'
net = require 'net'
async = require 'async'
chalk = require 'chalk'

ports = [22, 135, 3389, 1022, 554]
timeout = 40

portProbe = (port, host, timeout, callback) ->
  socket = new net.Socket()
  status = null
  error = null

  socket.setTimeout timeout

  socket.on 'connect', () ->
    status = 'open'
    socket.destroy()

  socket.on 'timeout', () ->
    status = 'closed'
    socket.destroy()

  socket.on 'error', (exception) ->
    error = exception
    status = 'closed'
    return

  socket.on 'close', () ->
    callback error, status

  socket.connect port, host

osTest = (ports, host, timeout, callback) ->
  foundPort = false
  numberOfPortsChecked = 0
  portIndex = 0
  port = ports[portIndex]

  if host is '' then return

  hasFoundPort = () ->
    return foundPort or numberOfPortsChecked is (ports.length - 1)

  checkNextPort = (callback) ->
    portProbe port, host, timeout, (error, statusOfPort) ->
      numberOfPortsChecked++
      if statusOfPort is 'open'
        foundPort = true
        callback error
      else
        portIndex++
        port = ports[portIndex]
        callback null

  async.until hasFoundPort, checkNextPort, (error) ->
    if error
      callback error, port
    else if foundPort
      callback null, port
    else
      callback null, false

processHost = (host) ->
  osTest ports, host, timeout, (error, port) ->
    if port is false
      console.log chalk.red host
    else
      switch port
        when 22 then console.log chalk.green host
        when 135 then console.log chalk.blue host
        when 3389 then console.log chalk.cyan host
        when 1022 then console.log chalk.magenta host
        when 554 then console.log chalk.yellow host
        else console.log chalk.red host

fs.readFile process.argv[2], 'utf-8', (err, data) ->
  if err then throw err
  hosts = data.toString().split '\n'
  processHost host for host in hosts

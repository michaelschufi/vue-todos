// hello-server-attach.js
const PORT = process.env.PORT || 2403
const ENV = process.env.NODE_ENV || 'development'

// setup http + express + socket.io
const fs = require('fs')
const express = require('express')

const app = express()

const privateKey = fs.readFileSync('./privkey.pem', 'utf8')
const certificate = fs.readFileSync('./cert.pem', 'utf8')

const credentials = { key: privateKey, cert: certificate }

const server = require('https').createServer(credentials, app)
const io = require('socket.io').listen(server, { 'log level': 0 })

// setup deployd
require('deployd').attach(server, {
  socketIo: io, // if not provided, attach will create one for you.
  env: ENV,
  db: {
    host: 'localhost',
    port: 27017,
    name: 'todos',
    credentials: {
      username: 'deployd',
      password: '',
    },
  },
})

// After attach, express can use server.handleRequest as middleware
app.use(server.handleRequest)

// start server
server.listen(PORT)

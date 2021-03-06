"use strict"

const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const config = require('./config/database')

mongoose.connect(config.database)

mongoose.connection.on('connected', () =>{
  console.log('connected to database ' + config.database)
})
mongoose.connection.on('error', (error) =>{
  console.log('Database error ' + error)
})

mongoose.Promise = require('bluebird')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/img/favicon/favicon.ico'))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// CORS Middleware
app.use(cors())

// GET home page
app.get('/', function(req, res, next) {
  res.render('index', { title: 'Lincs Project' })
})

app.get('/test', function(req, res, next) {
  res.render('test', { title: 'Lincs Project' })
})

// Download Routes
const api = require('./routes/api')
app.use('/api', api)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        })
    })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    })
})

module.exports = app

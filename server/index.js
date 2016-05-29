'use strict'

const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')
const _ = require('lodash')
const Url = require('./models/urls')

dotenv.config({
  silent: true
})

mongoose.connect(process.env.MONGODB_URL)

var app = express()

app.use(cors())

/**
 * Url Middleware
 *
 * For removing base path from the url request
 * @param  {number} remove  Number of items to remove from head
 * @return {function}       Middleware
 */
function urlMiddleware(remove) {
  if (typeof remove !== 'number' || remove < 0) {
    remove = 0
  }

  return function(req, res, next) {
    const url = req.path.split('/')

    url.splice(0, remove)

    req.url = url.join('/')

    next()
  }
}

app.get('/new/*', urlMiddleware(2), function(req, res) {
  const base = _.random(8000, 800000)

  const url = new Url({
    base: base,
    original: req.url,
    short: base.toString(36)
  })

  url.save(function (error) {
    if (error) { return res.sendStatus(500) }

    return res.send(url)
  })
})

app.get('/:short', function(req, res, next) {
  if (req.params.short) {
    Url.findOne({ short: req.params.short }, function(error, url) {
      if (error) { return next(error) }

      if (req.xhr) {
        return res.json({
          oringal: url.original,
          short: url.short
        })
      }

      return res.redirect(url.original)
    })
  }
})

app.get('*', function(req, res) {
  res.sendStatus(404)
})

module.exports = app

'use strict'

const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')
const _ = require('lodash')
const Url = require('./models/urls')
const urlMiddleware = require('./middleware/url-middleware')
const rejectFavicon = require('./middleware/reject-favicon')

dotenv.config({
  silent: true
})

mongoose.connect(process.env.MONGODB_URL)

var app = express()

app.use(cors())

app.use(rejectFavicon)

app.get('/new/*', urlMiddleware(2), function(req, res) {
  Url.findOne({ original: req.url }, (error, existing) => {
    if (error) { return res.statusStatus(500) }

    else if (existing) {
      return res.send(existing)
    }

    else {
      const base = _.random(8000, 800000)

      const url = new Url({
        base: base,
        original: req.url,
        short: base.toString(36)
      })

      url.save(function (error) {
        if (error) { return res.statusStatus(500) }

        return res.send(url)
      })
    }
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

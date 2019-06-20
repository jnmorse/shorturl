const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')
const Url = require('./models/urls')
const urlMiddleware = require('./middleware/url-middleware')
const rejectFavicon = require('./middleware/reject-favicon')
const sh = require('shorthash')

dotenv.config({
  silent: true
})

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true })

const app = express()

app.use(cors())

app.use(rejectFavicon)

app.get('/new/*', urlMiddleware(2), function(req, res, next) {
  Url.findOne({ original: req.url }, (error, existing) => {
    if (error) {
      return res.statusStatus(500)
    } else if (existing) {
      return res.send(existing)
    }

    const url = new Url({
      original: req.url,
      short: sh.unique(req.url)
    })

    url.save(function(err) {
      if (err) {
        res.sendStatus(500)
        next(err)
      }

      return res.send(url)
    })
  })
})

app.get('/:short', function(req, res, next) {
  if (req.params.short) {
    Url.findOne({ short: req.params.short }, function(error, url) {
      if (error) {
        return next(error)
      }

      if (req.xhr) {
        return res.json({
          oringal: url.original,
          short: url.short
        })
      }
      console.log(url)

      return res.redirect(url.original)
    })
  }
})

app.get('*', function(req, res) {
  res.sendStatus(404)
})

app.use((err, req, res, next) => {
  if (err) {
    console.log(error)

    next()
  }
})

module.exports = app

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
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true
})

const app = express()

app.use(cors())

app.use(rejectFavicon)

app.get('/new/*', urlMiddleware(2), async (req, res) => {
  const existing = await Url.findOne({ original: req.url })

  if (existing) {
    return res.json(existing)
  }

  const url = await new Url({
    original: req.url,
    short: sh.unique(req.url)
  }).save()

  return res.json(url)
})

app.get('/:short', (req, res, next) => {
  if (req.params.short) {
    Url.findOne({ short: req.params.short }, (error, url) => {
      if (error) {
        return next(error)
      }

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

app.get('*', (req, res) => {
  res.sendStatus(404)
})

app.use((error, req, res, next) => {
  if (error) {
    // eslint-disable-next-line no-console
    console.log(error)

    next()
  }
})

module.exports = app

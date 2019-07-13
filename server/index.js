const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const Url = require('./models/urls');
const urlMiddleware = require('./middleware/url-middleware');
const rejectFavicon = require('./middleware/reject-favicon');
const sh = require('shorthash');

dotenv.config({
  silent: true
});

mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  // eslint-disable-next-line no-console
  .catch(error => console.dir(error.message));

const app = express();

app.use(cors());

app.use(rejectFavicon);

app.get('/new/*', urlMiddleware(2), async (req, res, next) => {
  let existing;

  try {
    existing = await Url.findOne({ original: req.url });
  } catch (error) {
    next(error.message);
  }

  if (existing) {
    return res.json(existing);
  }

  const url = await new Url({
    original: req.url,
    short: sh.unique(req.url)
  }).save();

  const verifyUrl = await Url.findOne({ original: req.url });

  if (verifyUrl === req.url) {
    return res.json(url);
  }

  return next('url was not saved');
});

app.get('/:short', async (req, res, next) => {
  const { short } = req.params;

  if (short) {
    const url = await Url.findOne({ short });

    if (url) {
      return res.redirect(url.original);
    }

    return next('url does not exist');
  }

  return next('short url not provided');
});

app.get('*', (req, res) => {
  res.sendStatus(404);
});

app.use((error, req, res, next) => {
  if (error) {
    return res.status(500).send(error);
  }

  return next();
});

module.exports = app;

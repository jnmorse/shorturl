const mongoose = require('mongoose')
const Schema = mongoose.Schema

const urlSchema = new Schema({
  original: {
    type: String,
    unique: true,
    lowercase: true,
    required: true
  },
  short: {
    type: String,
    unique: true,
    required: true
  }
})

module.exports = mongoose.model('url', urlSchema)

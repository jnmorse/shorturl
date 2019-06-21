module.exports = url =>
  url.match(/^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?\??\S*$/u)

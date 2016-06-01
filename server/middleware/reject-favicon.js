function rejectFavicon(req, res, next) {
  if (req.url.match(/^\/favicon/)) {
    return res.sendStatus(404)
  }

  next()
}

module.exports = rejectFavicon

module.exports = function rejectFavicon(req, res, next) {
  if (req.url.match(/^\/favicon/u)) {
    return res.sendStatus(404)
  }

  return next()
}

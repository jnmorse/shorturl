const validURL = require('../lib/valid-url')

/**
 * Url Middleware
 *
 * For removing base path from the url request
 * @param  {number} remove  Number of items to remove from head
 * @return {function}       Middleware
 */
module.exports = function urlMiddleware(remove = 0) {
  return function middleware(req, res, next) {
    const url = req.url.split('/')

    url.splice(0, remove)

    req.url = url.join('/')

    if (!validURL(req.url)) {
      return res.sendStatus(400)
    }

    return next()
  }
}

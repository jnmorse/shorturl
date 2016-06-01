const validURL = require('../lib/valid-url')

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
    const url = req.url.split('/')

    url.splice(0, remove)

    req.url = url.join('/')

    if (!validURL(req.url)) {
      return res.sendStatus(400)
    }

    next()
  }
}

module.exports = urlMiddleware

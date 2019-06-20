const app = require('./server')
const http = require('http')

const port = process.env.PORT || 3000

http.createServer(app).listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening at: http://localhost:${port}/`)
})

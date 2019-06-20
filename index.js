const app = require('./server')

const port = process.env.PORT || 3000
const { stdout } = process

app.listen(port, function(err) {
  if (err) {
    stdout.write(`${err}\n\n`)
  } else {
    stdout.write(`Listening on port: ${port}\n\n`)
  }
})

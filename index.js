var app = require('./server');

var port = process.env.PORT || 3000;
var stdout = process.stdout;

app.listen(port, function(err) {
  if (err) {
    stdout.write(err + '\n\n');
  }

  else {
    stdout.write('Listening on port: ' + port + '\n\n');
  }
});

var http = require('http');
var url = require('url');

http.createServer(function (req, res) {
  console.log('URl ', req.url);
  console.log('MEthod', req.method);
  res.writeHead(200, {'Content-Type': 'text/html'});
  var q = url.parse(req.url, true).query;
  console.log('q ', q);
  var txt = q.year + " " + q.month;
  res.end(txt);
}).listen(8080);
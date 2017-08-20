var router = require("./router.js");

//Create a web server
var http = require("http");
http.createServer(function(request, response) {
  router.home(request, response);
  router.artist(request, response);
}).listen(3000);

console.log('SERVER RUNNING...');


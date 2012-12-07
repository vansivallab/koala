// server.js
// a very simple node server using the express module
var express = require("express");
//var fs = require("fs");
var app = express();
var wwwDir = "/../www";
//console.log('files: '+JSON.stringify(fs.readdirSync(__dirname+wwwDir+"/")));

app.use("/", express.static(__dirname + wwwDir+'/'));
app.get("/", function(req, res) { res.render(wwwDir + "/index.html");});
app.listen(8080);
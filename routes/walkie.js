var express = require('express');
var router = express.Router();
var appRoot = require('app-root-path');

//
var app = require("express")();
var http = require("http").Server(app);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(appRoot + "/index.html");
});


module.exports = router;

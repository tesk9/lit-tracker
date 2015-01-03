var express = require('express');
var router = express.Router();
var http = require('http');
var $ = require('jquery')(require('jsdom').jsdom().parentWindow);
var db = require('../db/bookRankings.js');

/* GET home page. */
router.get('/', function(req, res) {
  console.log("rendering index");
  res.render('index', { title: 'BookTracker' });
});

//db.addBook({name: "Yes Please", author: "Amy Poehler", url: "http://www.amazon.com/Yes-Please-Amy-Poehler/dp/0062268341/ref=tmm_hrd_swatch_0?_encoding=UTF8&sr=1-1&qid=1419636038"}, function(result) {console.log("Book Added.")});

var download = function(url, callback) {
  http.get(url, function(res) {
  console.log("Got response: " + res.statusCode);
  var data = "";
  res.on("data", function(chunk) {
      data += chunk;
    });

    res.on("end", function() {
      callback(data);
    });
  }).on("error", function(e) {
    console.log("Error: " + e.message);
  });
}

var getCurrentRankings = function() {
  db.getAllURLs(function(result) {
    var books = result;  
    books.forEach(function(v) {
      download(v.url, function(data) {
        if (data) {
          var $data = $($.parseHTML(data));
          var sales = $data.find("#SalesRank").text();
          var start = sales.indexOf("#") + 1;
          sales = sales.slice(start);
          var end = sales.indexOf(" ");
          sales = sales.slice(0, end);
          var time = new Date();
          db.addRanking({book_id: v.book_id, ranking: sales, date: time.getTime()});
        }
      }
    )});
  });
}

getCurrentRankings();


module.exports = router;

var express = require('express');
var router = express.Router();
var http = require('http');
var $ = require('jquery')(require('jsdom').jsdom().parentWindow);

/* GET home page. */
router.get('/', function(req, res) {
  console.log("rendering index");
  res.render('index', { title: 'BookTracker' });
});

var urls = ["http://www.amazon.com/Yes-Please-Amy-Poehler/dp/0062268341/ref=tmm_hrd_swatch_0?_encoding=UTF8&sr=1-1&qid=1419636038",
            "http://www.amazon.com/George-Martins-Thrones-5-Book-Boxed-ebook/dp/B00957T6X6/ref=sr_1_2?s=books&ie=UTF8&qid=1420060001&sr=1-2&keywords=fire+and+ice"]

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

urls.forEach(function(v) {
  download(v, function(data) {
    if (data) {
      var $data = $($.parseHTML(data));
      var sales = $data.find("#SalesRank").text();
      var start = sales.indexOf("#") + 1;
      sales = sales.slice(start);
      var end = sales.indexOf(" ");
      sales = sales.slice(0, end);
      console.log("Sales Ranking: " + sales);
    }
  }
)});


module.exports = router;

var express = require('express');
var router = express.Router();
var http = require('http');
var $ = require('jquery')(require('jsdom').jsdom().parentWindow);
var db = require('../db/bookRankings.js');

//db.addBook({name: "Yes Please", author: "Amy Poehler", url: "http://www.amazon.com/Yes-Please-Amy-Poehler/dp/0062268341/ref=tmm_hrd_swatch_0?_encoding=UTF8&sr=1-1&qid=1419636038"}, function(result) {console.log("Book Added.")});
// db.addBook({name: "The Giving Tree", author: "Shel Silverstein", url: "http://www.amazon.com/Giving-Tree-Shel-Silverstein-ebook/dp/B00DB2QZPI/ref=sr_1_1?s=digital-text&ie=UTF8&qid=1420330728&sr=1-1&keywords=the+giving+tree"}, function(result) {console.log("Book Added.")});

var cleanUpInt = function(numStr) {
  return numStr.replace(/\,/g, '');
};

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
};

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
          sales = cleanUpInt(sales);
          console.log("Sales ranking for " + v.name + ": " + sales);
          var time = new Date();
          db.addRanking({book_id: v.book_id, ranking: sales, date: time});
        }
      }
    )});
  });
};

setInterval(getCurrentRankings, 8640000);

 // GET home page. 
router.get('/', 
  function(req, res) {
    console.log("rendering index");
    res.render('index', { title: 'LitTracker' });
  }
);

router.get('/displays',
  function(req, res) {
    // console.log("Headers sent (before all rankings): " + res.headersSent)
    db.getAllRankings(function(r){
      // console.log("Headers sent (after all rankings): " + res.headersSent)
      if(r && res.headersSent === false) {res.send({ rankings: JSON.stringify(r) });}
      // console.log("Headers sent (after 'send'): " + res.headersSent)
    });
  }
);

// router.get('/', function(req, res) {
//   db.getAllRankings(function(r) {
//     res.render('index', { title: 'LitTracker', 
//                           rankings: JSON.stringify(r) }
//               )
//   })
// })

module.exports = router;

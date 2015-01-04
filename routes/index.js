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

setInterval(getCurrentRankings, 864000);
// getCurrentRankings();

 // GET home page. 
router.get('/', 
  function(req, res) {
    console.log("rendering index");
    res.render('index', { title: 'LitTracker' });
  }
);

router.get('/urls/:id',
  function(req, res) {
    db.getRankingsByBook( {book_id: req.params['id']}, function(r) {
      res.send({ rankings: JSON.stringify(r) });
    })
  }
);

router.get('/urls',
  function(req, res) {
    db.getAllURLs(function(books) {
      res.send({ books: JSON.stringify(books) });
    })
  }
);

router.post('/new',
  function(req, res) {
    db.addBook({name: req.body.name, author: req.body.author, url: req.body.url});
    res.redirect('/');
  }
);


module.exports = router;

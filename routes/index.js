var express = require('express');
var router = express.Router();
var http = require('http');
var $ = require('jquery')(require('jsdom').jsdom().parentWindow);
var db = require('../db/bookRankings.js');

// Standardize number format
var cleanUpInt = function(numStr) {
  return numStr.replace(/\,/g, '');
};

// Helper function for scraper
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

// Amazon Scraper
var getCurrentRankings = function() {
  db.getAllURLs(function(result) {
    var books = result;  
    books.forEach(function(v) {
      download(v.url, function(data) {
        scrape(v, data);
      });
    });
  });
};

var scrape = function(book, data) {
  if (data) {
    var $data = $($.parseHTML(data));
    var sales = $data.find("#SalesRank").text();
    var start = sales.indexOf("#") + 1;
    sales = sales.slice(start);
    var end = sales.indexOf(" ");
    sales = sales.slice(0, end);
    sales = cleanUpInt(sales);
    console.log("Sales ranking for " + book.name + ": " + sales);
    var time = new Date();
    db.addRanking({book_id: book.book_id, ranking: sales, date: time});
  }
}

setInterval(getCurrentRankings, 86400000);
// getCurrentRankings();

 // GET home page. 
router.get('/', 
  function(req, res) {
    console.log("rendering index");
    res.render('index', { title: 'LitTracker' });
  }
);

 // GET all rankings for specified book
router.get('/urls/:id',
  function(req, res) {
    db.getRankingsByBook( {book_id: req.params['id']}, function(r) {
      res.send({ rankings: JSON.stringify(r) });
    })
  }
);

// GET all tracked books
router.get('/urls',
  function(req, res) {
    db.getAllURLs(function(books) {
      res.send({ books: JSON.stringify(books) });
    })
  }
);

// POST a new book to track
// router.post('/new',
//   function(req, res) {
//     db.addBook({name: req.body.name, author: req.body.author, url: req.body.url}, function(r) {
//       console.log(r);
//       download(r[0].url, function(data) {
//         scrape(r[0], data);
//       });
//       res.send({ rankings: JSON.stringify(r[0]) });
//     });
//   }
// );


module.exports = router;

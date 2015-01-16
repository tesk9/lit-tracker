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
  db.getAllBooks(function(result) {
    var books = result;  
    books.forEach(function(book) {
      db.getBookURLs({ book_id: book.book_id }, function(urls) {
        urls.forEach(function(v) {
          download(v.url, function(data) {
            scrape(v, data);
          });
        })
      })
    });
  });
};

var scrape = function(url, data) {
  if (data) {
    var $data = $($.parseHTML(data));
    var sales = $data.find("#SalesRank").text();
    var start = sales.indexOf("#") + 1;
    sales = sales.slice(start);
    var end = sales.indexOf(" ");
    sales = sales.slice(0, end);
    sales = cleanUpInt(sales);
    console.log("Sales ranking for url_id " + url.url_id + ": " + sales);
    var time = new Date();
    db.addRanking({url_id: url.url_id, ranking: sales, date: time});
  }
}

// setInterval(getCurrentRankings, 1005);
// getCurrentRankings();

 // GET home page. 
router.get('/', 
  function(req, res) {
    console.log("rendering index");
    res.render('index', { title: 'LitTracker' });
  }
);

 // GET all rankings for specified book
// router.get('/books/:id',
//   function(req, res) {
//     var chunk = [];
//     db.getBookURLs({book_id: req.params['id']}, function(urls) {
//       urls.forEach(function(url) {
//         db.getRankingsByURL({url_id: url.url_id}, function(r) {
//           chunk.push(r);
//         });
//       })
//       console.log(chunk.length)
//       console.log(urls.length)
//       if(chunk.length == urls.length) {
//         res.send({ rankings: JSON.stringify(chunk) });
//       }
//     })
//   }
// );

router.get('/books/:id',
  function(req, res) {
    db.getRankingsByBook({book_id: req.params['id']}, function(rankings) {
      res.send({ rankings: JSON.stringify(rankings) });
    })
  }
);

// GET all tracked books
router.get('/books',
  function(req, res) {
    db.getAllBooks(function(books) {
      res.send({ books: JSON.stringify(books) });
    })
  }
);

// POST a new book to track
router.post('/new',
  function(req, res) {
    db.addBook({name: req.body.name, author: req.body.author, url: req.body.url}, function(r) {
      db.addBookURL(r[0], req.body.url, function(response) {
        download(req.body.url, function(data) {
          scrape(r[0], data);
        });
        res.send({ 
          status: 200,
          book: JSON.stringify(r[0])
        })
      })
    });
  }
);


module.exports = router;

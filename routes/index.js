var express = require('express');
var router = express.Router();
var db = require('../db/bookRankings.js');

 // GET home page. 
router.get('/', 
  function(req, res) {
    res.render('index', { title: 'LitTracker' });
  }
);

 // GET all rankings for specified book
router.get('/books/:id',
  function(req, res) {
    db.getRankingsByBook({book_id: req.params['id']}, function(rankings) {
      res.send({ rankings: JSON.stringify(rankings) });
    });
  }
);

// POST a new url to track
router.get('/books/:id/urls/new',
  function(req, res) {
    var errorHandler = errorHandler.bind(res);
    db.addBookURL({book_id: req.params['id'], url: req.body.url, edition: req.body.edition}, function(r) {
      res.send({ status: 200 });
    }, function(status, err) {
      res.status(status).send(err);
    });
  })

// GET all tracked books
router.get('/books',
  function(req, res) {
    db.getAllBooks(function(books) {
      res.send({ books: JSON.stringify(books) });
    });
  }
);

// POST a new book to track
router.post('/books/new',
  function(req, res) {
    db.addBook({name: req.body.name, author: req.body.author, url: req.body.url}, function(r) {
      db.addBookURL({book_id: r[0].book_id, url: req.body.url, edition: req.body.edition}, function(response) {
        download(req.body.url, function(data) {
          scrape(response[0], data);
        });
        res.send({ 
          status: 200,
          book: JSON.stringify(r[0])
        });
      }, function(status, err) {
        res.status(status).send(err);
      });
    }, function(status, err) {
      res.status(status).send(err);
    });
  }
);


module.exports = router;

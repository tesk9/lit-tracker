var express = require('express');
var router = express.Router();
var db = require('../db/bookRankings.js');
var download = require('../utils/utils.js');
var amazon = require('../scrapers/amazon.js');
var passport = require('passport');
var facebookStrategy = require('passport-facebook').Strategy;
try {
  require('../locals.js');
} catch(err) {
  console.log(err);
}

 // GET home page. 
router.get('/', function(req, res) {
  res.render('index', { title: 'LitTracker' });
});

 // GET all rankings for specified book
router.get('/books/:id', function(req, res) {
  db.getRankingsByBook({book_id: req.params['id']}, function(rankings) {
    res.send({ rankings: JSON.stringify(rankings) });
  });
});

router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/#/rankings',
  failureRedirect: '/'
}));

passport.use(new facebookStrategy({
  clientID: process.env.FACEBOOK_ID || 'facebook_id',
  clientSecret: process.env.FACEBOOK_SECRET || 'facebook_secret',
  callbackURL: "/auth/facebook/callback"
}, function(accessToken, refreshToken, profile, done) {
  done();
}));

// POST a new url to track
router.post('/books/:id/urls/new', function(req, res) {
  db.addBookURL({book_id: req.params['id'], url: req.body.url, edition: req.body.edition}, function(r) {
    res.send({ status: 200 });
  }, function(status, err) {
    res.status(status).send(err);
  });
})

// GET all tracked books
router.get('/books', function(req, res) {
  db.getAllBooks(function(books) {
    res.send({ books: JSON.stringify(books) });
  });
});

// POST a new book to track
// router.post('/books/new', function(req, res) {
//   db.addBook({name: req.body.name, author: req.body.author}, function(r) {
//     db.addBookURL({book_id: r[0].book_id, url: req.body.url, edition: req.body.edition}, function(response) {
//       download(req.body.url, function(data) {
//         amazon.scrape(response[0], data);
//       });
//       res.send({ 
//         status: 200,
//         book: JSON.stringify(r[0])
//       });
//     }, function(status, err) {
//       res.status(status).send(err);
//     });
//   }, function(status, err) {
//     res.status(status).send(err);
//   });
// });


module.exports = router;

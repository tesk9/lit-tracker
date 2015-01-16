module.exports = function() {
  var pg = require('pg');
  var conString = process.env.DATABASE_URL || "postgres://tessakelly:1234@localhost/lit-tracker-db";

  var dbQuery = function(callback, queryString, array) {
    pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }

      client.query(queryString, array, function(err, result) {
        done();

        if(err) {
          return console.error('error running query', err);
        }
        
        if(callback) {
          callback(result.rows);
        }

        return;
      })
    })  
  };

  var createBooks = function(callback) {
    var queryString = ['CREATE TABLE IF NOT EXISTS books(',
                       'book_id SERIAL PRIMARY KEY,',
                       'name text,',
                       'author text',
                       ');'].join(" ");
    dbQuery(callback, queryString, []);
  }

  var createURLs = function(callback) {
    var queryString = ['CREATE TABLE IF NOT EXISTS urls(',
                       'url_id SERIAL PRIMARY KEY,',
                       'url text,',
                       'book_id integer REFERENCES books(book_id)',
                       ');'].join(" ");
    dbQuery(callback, queryString, []);
  }

  var createRankings = function(callback) {
    var queryString = ['CREATE TABLE IF NOT EXISTS rankings(',
                       'ranking_id SERIAL PRIMARY KEY,',
                       'url_id integer REFERENCES urls(url_id),',
                       'ranking integer,',
                       'date date',
                        ');'].join(" ")
    dbQuery(callback, queryString, []);
  }

  var addBook = function(params, callback) {
    if (params.name && params.author && params.url) {
      var queryString = ['INSERT INTO books(name, author)',
                         'VALUES ($1, $2)',
                         'RETURNING *;'
                         ].join(" ");
      dbQuery(callback, queryString, [params.name, params.author]);
    } else {
      console.log('database does not accept empty values for book name, author, or url');
    }
  };

  var addBookURL = function(data, url, callback) {
    var queryString = ['INSERT INTO urls(book_id, url)',
                       'VALUES($1, $2)',
                       'RETURNING *',
                       ';'].join(" ")
    dbQuery(callback, queryString, [data.book_id, url])
  }

  var getBookURLs = function(params, callback) {
    if (params.book_id) {
      var queryString = ['SELECT * FROM urls',
                         'WHERE book_id=$1;'].join(" ");
      dbQuery(callback, queryString, [params.book_id]);
    } else {
      console.log('desired book_id must be specified');
    }
  };

  var getAllBooks = function(callback) {
    var queryString = 'SELECT * FROM books';
    dbQuery(callback, queryString, []);
  }

  var addRanking = function(params, callback) {
    if (params.url_id && params.ranking && params.date) {
      var queryString = ['INSERT INTO rankings(url_id, ranking, date)',
                       'VALUES ($1, $2, $3);'].join(" ");
      dbQuery(callback, queryString, [params.url_id, params.ranking, params.date]);
    } else {
      console.log('database does not accept empty values for url id, book ranking, or date');
    }
  };

  var getRankingsByURL = function(params, callback) {
    console.log(params.url_id)
    if (params.url_id) {
      var queryString = ['SELECT * FROM rankings',
                         'WHERE url_id=$1'].join(" ");
      dbQuery(callback, queryString, [params.url_id]);
    } else {
      console.log('error in bookRankings.js');
    }
  }

  createBooks();
  createURLs();
  createRankings();

  return {
    addBook : addBook,
    addBookURL : addBookURL,
    getBookURLs : getBookURLs,
    addRanking : addRanking,
    getAllBooks : getAllBooks,
    getRankingsByURL : getRankingsByURL
  }

}();

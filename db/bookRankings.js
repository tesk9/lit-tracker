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
  createBooks();

  var createURLs = function(callback) {
    var queryString = ['CREATE TABLE IF NOT EXISTS urls(',
                       'url_id SERIAL PRIMARY KEY,',
                       'url text,',
                       'edition text,',
                       'book_id integer REFERENCES books(book_id)',
                       ');'].join(" ");
    dbQuery(callback, queryString, []);
  }
  createURLs();

  var createRankings = function(callback) {
    var queryString = ['CREATE TABLE IF NOT EXISTS rankings(',
                       'ranking_id SERIAL PRIMARY KEY,',
                       'url_id integer REFERENCES urls(url_id),',
                       'ranking integer,',
                       'date timestamp',
                        ');'].join(" ")
    dbQuery(callback, queryString, []);
  }
  createRankings();

  var addBook = function(params, callback) {
    if(!params.name || !params.author) { return; }
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

  var addBookURL = function(params, callback) {
    if(!params.book_id || !params.url) { return; }
    var queryString = ['INSERT INTO urls(book_id, url, edition)',
                       'VALUES($1, $2, $3)',
                       'RETURNING *',
                       ';'].join(" ")
    dbQuery(callback, queryString, [params.book_id, params.url, params.edition]);
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
    if (params.url_id && params.ranking && params.date && (params.date instanceof Date)) {
      var queryString = ['INSERT INTO rankings(url_id, ranking, date)',
                       'VALUES ($1, $2, $3);'].join(" ");
      dbQuery(callback, queryString, [params.url_id, params.ranking, params.date]);
    } else {
      console.log('database does not accept empty values for url id, book ranking, or date');
    }
  };

  var getRankingsByBook = function(params, callback) {
    if (params.book_id) {
      var queryString = ['SELECT *',
                            'FROM rankings r, urls u',
                            'WHERE u.book_id=$1 AND u.url_id = r.url_id'].join(" ");
      dbQuery(callback, queryString, [params.book_id]);
    } else {
      console.log('Missing book_id in params');
    }
  }

  return {
    addBook : addBook,
    addBookURL : addBookURL,
    getBookURLs : getBookURLs,
    addRanking : addRanking,
    getAllBooks : getAllBooks,
    getRankingsByBook: getRankingsByBook
  }

}();

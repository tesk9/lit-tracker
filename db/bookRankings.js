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
  };

  var createURLs = function(callback) {
    var queryString = ['CREATE TABLE IF NOT EXISTS urls(',
                       'url_id SERIAL PRIMARY KEY,',
                       'url text,',
                       'edition text,',
                       'book_id integer REFERENCES books(book_id)',
                       ');'].join(" ");
    dbQuery(callback, queryString, []);
  };

  var createRankings = function(callback) {
    var queryString = ['CREATE TABLE IF NOT EXISTS rankings(',
                       'ranking_id SERIAL PRIMARY KEY,',
                       'url_id integer REFERENCES urls(url_id),',
                       'ranking integer,',
                       'date timestamp',
                        ');'].join(" ")
    dbQuery(callback, queryString, []);
  };

  var dropTables = function(callback) {
    var queryString = ['DROP TABLE IF EXISTS rankings CASCADE;',
                       'DROP TABLE IF EXISTS urls CASCADE;',
                       'DROP TABLE IF EXISTS books CASCADE;'].join(" ");
    dbQuery(callback, queryString, []);
  };

  var createTables = function(callback) {
    createBooks(function() {
      createURLs(function() {
        createRankings(function(){
          if(callback) {
            callback(); 
          }
        });
      })
    });
  };

  var addBook = function(params, callback, failure) {
    if (params.name && params.author && params.name.length > 5 && params.author.length > 5) {
      var queryString = ['INSERT INTO books(name, author)',
                         'VALUES ($1, $2)',
                         'RETURNING *;'
                         ].join(" ");

      // Check to see if book is stored in database already
      checkForBook(params, function() {
        // If book is not found, this query will be run:
        dbQuery(callback, queryString, [params.name, params.author]);
      }, function() {
        // Book already stored in database
        failure(302, 'book is already stored');
      });
    } else {
      failure(400, 'database does not accept empty values for book name or author.');
    }
  };

  var checkForBook = function(params, callback, failure) {
    var queryString = ['SELECT * FROM books',
                      'WHERE name=$1 AND author=$2;'].join(" ");
    dbQuery(function(results) {
      if(results.length > 0) {
        failure();
      } else {
        callback();
      }
    }, queryString, [params.name, params.author]);
  };

  var addBookURL = function(params, callback, failure) {
    if(!params.book_id || !params.url) { 
      failure(400, 'Missing ' + params.book_id ? 'book id' : 'url');
    } else if(/^https:\/\/www.amazon.com/.test(params.url) || /^http:\/\/www.amazon.com/.test(params.url)) {
      var queryString = ['INSERT INTO urls(book_id, url, edition)',
                         'VALUES($1, $2, $3)',
                         'RETURNING *',
                         ';'].join(" ")
      dbQuery(callback, queryString, [params.book_id, params.url, params.edition]);
    } else {
      failure(400, "Invalid url");
    }
  };

  var getBookURLs = function(params, callback, failure) {
    if (params.book_id) {
      var queryString = ['SELECT * FROM urls',
                         'WHERE book_id=$1;'].join(" ");
      dbQuery(callback, queryString, [params.book_id]);
    } else {
      failure(400, 'desired book_id must be specified');
    }
  };

  var getAllBooks = function(callback) {
    var queryString = 'SELECT * FROM books';
    dbQuery(callback, queryString, []);
  }

  var addRanking = function(params, callback, failure) {
    if (params.url_id && params.ranking && params.date && (params.date instanceof Date)) {
      var queryString = ['INSERT INTO rankings(url_id, ranking, date)',
                       'VALUES ($1, $2, $3);'].join(" ");
      dbQuery(callback, queryString, [params.url_id, params.ranking, params.date]);
    } else {
      failure('database does not accept empty values for url id, book ranking, or date');
    }
  };

  var getRankingsByBook = function(params, callback, failure) {
    if (params.book_id) {
      var queryString = ['SELECT *',
                            'FROM rankings r, urls u',
                            'WHERE u.book_id=$1 AND u.url_id = r.url_id'].join(" ");
      dbQuery(callback, queryString, [params.book_id]);
    } else {
      failure(400, 'desired book_id must be specified');
    }
  };

  return {
    addBook : addBook,
    addBookURL : addBookURL,
    getBookURLs : getBookURLs,
    addRanking : addRanking,
    getAllBooks : getAllBooks,
    getRankingsByBook: getRankingsByBook,
    createTables : createTables,
    dropTables : dropTables
  }

}();

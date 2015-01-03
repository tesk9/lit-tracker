module.exports = function() {
  var pg = require('pg');
  var conString = "postgres://tessakelly:1234@localhost/lit-tracker-db";

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

  var addBook = function(params, callback) {
    var queryString = ['INSERT INTO books(name, author, url)',
                       'VALUES ($1, $2, $3);'].join(" ");
    dbQuery(callback, queryString, [params.name, params.author, params.url]);
  };

  var getBookData = function(params, callback) {
    var queryString = ['SELECT * FROM rankings',
                       'WHERE book_id=$1;'].join(" ");
    dbQuery(callback, queryString, [params.book_id]);
  };

  var getAllURLs = function(callback) {
    var queryString = 'SELECT * FROM books';
    dbQuery(callback, queryString, []);
  }

  var addRanking = function(params, callback) {
    var queryString = ['INSERT INTO rankings(book_id, ranking, date)',
                       'VALUES ($1, $2, $3);'].join(" ");
    dbQuery(callback, queryString, [params.book_id, params.ranking, params.date]);
  };

  return {
    addBook : addBook,
    getBookData : getBookData,
    addRanking : addRanking,
    getAllURLs : getAllURLs
  }

}();

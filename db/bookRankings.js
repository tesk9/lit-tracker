var pg = require('pg');
var conString = "postgres://postgres:1234@localhost/lit-tracker-db";

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
  var queryString = ['INSERT INTO books(name, author, isbn)',
                     'VALUES ($1, $2, $3);'].join();
  dbQuery(callback, queryString, [params.name, params.author, params.isbn || "000000000"]);
}

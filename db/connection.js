var pg = require('pg');
var conString = process.env.DATABASE_URL || "postgres://tessakelly:1234@localhost/lit-tracker-db-test";

module.exports = function(callback, queryString, array) {
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
    });
  });
};
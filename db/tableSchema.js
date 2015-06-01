var dbQuery = require("./connection.js");

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

module.exports = function() {
  return {
    dropTables: function(callback) {
      var queryString = ['DROP TABLE IF EXISTS rankings CASCADE;',
                         'DROP TABLE IF EXISTS urls CASCADE;',
                         'DROP TABLE IF EXISTS books CASCADE;'].join(" ");
      dbQuery(callback, queryString, []);
    },
    createTables: function(callback) {
      createBooks(function() {
        createURLs(function() {
          createRankings(function(){
            if(callback) {
              callback(); 
            }
          });
        });
      });
    }
  };
}();

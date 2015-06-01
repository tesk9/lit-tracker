var schema = require("../db/tableSchema.js");
var db = require("../db/bookRankings.js");

beforeEach(function(done) {
  schema.dropTables(function() {
    schema.createTables(function() {
      done();
    });
  });
});

describe("Rankings Table", function() {
  var book_id, url1;
  
  beforeEach(function(done) {
    db.addBook({name: "Yes Please", author: "Amy Poehler"}, function(r) {
      r = r[0];
      book_id = r.book_id;
      db.addBookURL({book_id: book_id, url: 'http://www.amazon.com/Yes-Please-Amy-Poehler/dp/0062268341/', edition: "Hardcover"}, function(r) {
        r = r[0];
        url1 = r.url_id;
        done();
      });
    });
  });

  it("Adds ranking to specified url", function(done) {
    db.addRanking({url_id: url1, ranking: 5, date: new Date(2015, 0, 1, 12)}, function() {
      db.getRankingsByBook({book_id: book_id}, function(rankings) {
        expect(rankings.length).toEqual(1);
        expect(rankings[0].ranking).toEqual(5);
        done();
      });
    });
  });

  it("Does not add empty rows to rankings table", function() {
    db.getRankingsByBook({book_id: book_id}, function(rankings) {
      var numRankings = rankings.length;
      db.addRanking({url_id: "", ranking: 1, date: new Date()}, function() {
        db.addRanking({url_id: 1, ranking: 2, date: new Date()}, function() {
          db.addRanking({url_id: 1, ranking: 3, date: "Date"}, function() {
            db.getRankingsByBook({book_id: book_id}, function(rankings) {
              expect(rankings.length).toEqual(numRankings);
              done();
            });
          });
        });
      });
    });
  });

});
var db = require('../db/bookRankings.js');

describe("Database Queries", function() {
  var book_id;

  describe("Books Table", function() {
    it("Adds books to books table", function() {
      db.addBook({name: "Yes Please", author: "Amy Poehler"}, function(r) {
        expect(r.name).toBe("Yes Please");
        expect(r.author).toBe("Amy Poehler");
        book_id = r.book_id;
      });

      db.addBook({name: "Picture of Dorian Gray", author: "Oscar Wilde"});
      db.addBook({name: "Jane Eyre", author: "Charlotte Bronte"});
      db.getAllBooks(function(books) {
        expect(books.length).toEqual(3);
      });
    });

    it("Does not add empty rows to books table", function() {
      db.addBook({name: "", author: "Author"})
      db.addBook({name: "Name", author: ""})
      db.getAllBooks(function(books) {
        expect(books.length).toEqual(3);
      });
    });
  });

  describe("Urls Table", function() {
    it("Adds Hardcover url for 'Yes Please'", function() {
      db.addBookURL({book_id: book_id, url: 'http://www.amazon.com/Yes-Please-Amy-Poehler/dp/0062268341/', edition: "Hardcover"}, function(r) {
        expect(r.book_id).toBe(book_id);
      });
    });
    it("Adds paperback url and kindle url for 'Yes Please'", function() {
      db.addBookURL({book_id: book_id, url: 'http://www.amazon.com/Yes-Please-Amy-Poehler-ebook/dp/B00IHZS39A/', edition: 'Kindle'});
      db.addBookURL({book_id: book_id, url: 'http://www.amazon.com/Yes-Please-Amy-Poehler/dp/006226835X', edition: "Paperback"});
      db.getBookURLs({book_id: book_id}, function(r) {
        expect(r.length).toEqual(3);
      });
    });
    it("Does not add empty rows to urls table", function() {
      db.addBookURL({book_id: book_id, url: "", edition: ""})
      db.getBookURLs({book_id: book_id}, function(r) {
        expect(r.length).toEqual(3);
      });
    });
  });

  describe("Rankings Table", function() {
    it("Adds ranking for url 1", function() {
      db.addRanking({url_id: 1, ranking: 5, date: new Date(2015, 0, 1, 12)});
      db.getRankingsByBook({book_id: 1}, function(rankings) {
        expect(rankings.length).toEqual(1);
        expect(rankings.ranking).toEqual(5);
      })
      db.addRanking({url_id: 2, ranking: 10, date: new Date(2015, 0, 1, 12)});
      db.getRankingsByBook({book_id: 1}, function(rankings) {
        expect(rankings.length).toEqual(2);
        expect(rankings.ranking).toEqual(10);
      })
      db.addRanking({url_id: 4, ranking: 5, date: new Date(2015, 0, 1, 12)});
      db.getRankingsByBook({book_id: 1}, function(rankings) {
        expect(rankings.length).toEqual(2);
        expect(rankings.ranking).toEqual(5);
      })
    });
    it("Does not add empty rows to rankings table", function() {
      var numRankings;
      db.getRankingsByBook({book_id: book_id}, function(rankings) {
        numRankings = rankings.length;
      })
      db.addRanking({url_id: "", ranking: 1, date: new Date()});
      db.addRanking({url_id: 1, ranking: 2, date: new Date()});
      db.addRanking({url_id: 1, ranking: 3, date: "Date"});
      db.getRankingsByBook({book_id: book_id}, function(rankings) {
        expect(rankings.length).toEqual(numRankings);
      })
    })
  });
  
});
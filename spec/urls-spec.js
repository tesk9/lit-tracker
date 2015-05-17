var db = require("../db/bookRankings.js");

beforeEach(function(done) {
  db.dropTables(function() {
    db.createTables(function() {
      done();
    });
  });
})

xdescribe("Urls Table", function(done) {
  var book_id, book_id2;

  beforeEach(function(done) {
    db.addBook({name: "Yes Please", author: "Amy Poehler"}, function(r) {
      r = r[0];
      book_id = r.book_id;
      done();
    });  
  });
  
  it("Adds Hardcover URl for 'Yes Please'", function(done) {
    db.addBookURL({book_id: book_id, url: 'http://www.amazon.com/Yes-Please-Amy-Poehler/dp/0062268341/', edition: "Hardcover"}, function(r) {
      r = r[0];
      expect(r.book_id).toBe(book_id);
      expect(r.url).toBe('http://www.amazon.com/Yes-Please-Amy-Poehler/dp/0062268341/');
      expect(r.edition).toBe("Hardcover");
      done();
    });
  });

  it("Adds paperback url and kindle url for 'Yes Please'", function(done) {
    db.addBookURL({book_id: book_id, url: 'http://www.amazon.com/Yes-Please-Amy-Poehler-ebook/dp/B00IHZS39A/', edition: 'Kindle'}, function(r) {
      db.addBookURL({book_id: book_id, url: 'http://www.amazon.com/Yes-Please-Amy-Poehler/dp/006226835X', edition: "Paperback"}, function(r) {
        db.getBookURLs({book_id: book_id}, function(r) {
          expect(r.length).toEqual(2);
          done();
        });
      });    
    });
  });

  it("Does not add empty rows to urls table", function(done) {
    var res = db.addBookURL({book_id: book_id, url: "", edition: ""});
    expect(res).toEqual(undefined);
    done();
  });
});
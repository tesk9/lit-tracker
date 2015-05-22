var db = require('../db/bookRankings.js');

beforeEach(function(done) {
  db.dropTables(function() {
    db.createTables(function() {
      done();
    });
  });
})

describe("Books Table: ", function(done) {
  var name, author, book_id, book_id2;

  beforeEach(function(done) {
    db.addBook({name: "Yes Please", author: "Amy Poehler"}, function(r) {
      r = r[0];
      name = r.name;
      author = r.author;
      book_id = r.book_id;
      done();
    });  
  });

  it("Adds book to books table", function(done) {
    expect(name).toBe("Yes Please");
    expect(author).toBe("Amy Poehler");
    done();
  });

  it("Does not add multiples of books", function() {
    expect(function() {
      db.checkForBook({name: "Yes Please", author: "Amy Poehler"}, function() {});
    }).toThrow();
  });

  describe("Returns all books", function(done) {
    var booksLength;

    beforeEach(function(done) {
      db.addBook({name: "Picture of Dorian Gray", author: "Oscar Wilde"}, function(r) {
        book_id2 = r.book_id;
        db.addBook({name: "Jane Eyre", author: "Charlotte Bronte"}, function() {
          db.getAllBooks(function(books) {
            booksLength = books.length;
            done();
          });
        });
      });
    })

    it("returns 3 books when 3 books are added", function(done) {
      expect(booksLength).toEqual(3);
      done();
    })

    it("Does not add empty rows to books table", function(done) {
      db.addBook({name: "", author: "Author"}, function() {
        // Sucess callback should not be executed
        expect(false).toBe(true);
      }, function() {
        db.addBook({name: "Name", author: ""}, function() {}, function() {
          expect(true).toBe(true);
          done();
        });
      });
    });
    
  });
});
var Query = (function() {
  var getAllBooks = function(callback) {
    $.get('/urls', function(books) {
      var books = JSON.parse(books.books);
      books.forEach(function(v) {
        if(callback) { 
          callback(v);
        }
      })
    })
  }

  var getBookUrls = function(book, callback) {
    $.get('/urls/' + book.book_id, function(data) {
      var data = JSON.parse(data.rankings);
      if(callback) {
        callback(data, book.book_id)
      }
    });
  }

  return {
    getAllBooks: getAllBooks,
    getBookUrls: getBookUrls
  };
  
})();

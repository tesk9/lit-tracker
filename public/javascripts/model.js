var Query = (function() {
  // var getAllBooks = function(callback) {
  //   $.get('/books', function(books) {
  //     var books = JSON.parse(books.books);
  //     books.forEach(function(v) {
  //       if(callback) { 
  //         callback(v);
  //       }
  //     })
  //   })
  // }

  var getAllBooks = function(callback) {
    return function(resolve, reject) {
      $.get('/books', function(books) {
        var books = JSON.parse(books.books);
        resolve(books);
      });
    };
  };

  var getBookRankings = function(book, callback) {
    $.get('/books/' + book.book_id, function(data) {
      var data = JSON.parse(data.rankings);
      if(callback) {
        callback(data, book.book_id)
      }
    });
  }

  return {
    getAllBooks: getAllBooks,
    getBookRankings: getBookRankings
  };
  
})();


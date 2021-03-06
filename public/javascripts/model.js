App.factory("queries", ["$q", function($q) {
  return {
    getAllBooks: function(callback) {
      return $q(function(resolve, reject) {
        $.get('/books', function(books) {
          var books = JSON.parse(books.books);
          resolve(books);
        });
      });
    },
    getBookRankings: function(book, callback) {
      $.get('/books/' + book.book_id, function(data) {
        var data = JSON.parse(data.rankings);
        if(callback) {
          callback(data, book.book_id)
        }
      });
    },
    addEdition: function(book, callback) {
      $.ajax({
        method: "POST",
        url: "/books/" + book.book_id + "/urls/new",
        data: book,
        success: function(data) {
          callback(data);
        }
      });
    }
  };
}]);


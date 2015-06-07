App.controller("graphController", ["$scope", "queries", "searchTerm", "grapher", function($scope, queries, searchTerm, grapher) {
  queries.getAllBooks().then(function(books) {
    $scope.books = books;

    books.forEach(function(book) {
      queries.getBookRankings(book, function(data, bookID) {
        grapher(data, bookID);
      });
    });
  });

  $scope.addEditionURL = function(book) {
    console.log(book)
    console.log($scope.books)
    if(book.url && book.edition && book.url.match(/^http:\/\/www.amazon.com\//)) {
      queries.addEdition(book, function() {
        console.log("SUBMITTED");
      });
    } else {
      console.log("NOT right format")
    }
  };

  $scope.filter = searchTerm.filter;
}]);



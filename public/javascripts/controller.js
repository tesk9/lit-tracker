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
    if(book.url && book.edition && book.url.match(/^http:\/\/www.amazon.com\//)) {
      queries.addEdition(book, function() {
        
      });
    }
  };

  $scope.filter = searchTerm.filter;
}]);



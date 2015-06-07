App.controller("graphController", ["$scope", "queries", "searchTerm", "grapher", function($scope, queries, searchTerm, grapher) {
  queries.getAllBooks().then(function(books) {
    $scope.books = books;

    books.forEach(function(book) {
      queries.getBookRankings(book, function(data, bookID) {
        grapher(data, bookID);
      });
    });
  });

  $scope.filter = searchTerm.filter;
}]);



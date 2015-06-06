App.controller("graphController", ["$scope", "$q", "searchTerm", function($scope, $q, searchTerm) {
  //TODO: Query.getAllBooks should return a promise
  $q(Query.getAllBooks()).then(function(books) {
    $scope.books = books;

    books.forEach(function(book) {
      Query.getBookRankings(book, function(data, bookID) {
        View.callGraph(data, bookID);
      });
    });
  });

  $scope.filter = searchTerm.filter;
}]);



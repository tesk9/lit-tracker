App.controller("graphController", ["$scope", "$q", function($scope, $q) {
  //TODO: Query.getAllBooks should return a promise
  $q(Query.getAllBooks()).then(function(books) {
    $scope.books = books;

    books.forEach(function(book) {
      Query.getBookRankings(book, function(data, bookID) {
        View.callGraph(data, bookID);
      });
    });
    
  });
}]);




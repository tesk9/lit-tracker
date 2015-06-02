App.controller("BookFormController", ["$scope", function($scope) {
  $scope.newBook = {
    name: "",
    author: "",
    url: "",
    edition: ""
  };
  var emptyForm = angular.copy($scope.newBook);

  $scope.submit = function() {
    var newBook = $scope.newBook;
    if(newBook.name && newBook.author && newBook.url && newBook.edition && newBook.url.match(/^http:\/\/www.amazon.com\//)) {
      var submission = angular.copy($scope.newBook);
      clearForm();
      newMessage(submission.name+" by "+submission.author+" has been added.");
      $.ajax({
        url: '/books/new',
        type: 'POST',
        data: submission
      });
    } else if(!newBook.name || !newBook.author || !newBook.url || !newBook.edition) {
      newMessage("All fields required")
    } else {
      newMessage("Double check your Amazon URL");
    }
  };

  var clearForm = function() {
    $scope.newBook = emptyForm;
    $scope.addBookForm.$setPristine();
    newMessage("");
  };

  var newMessage = function(message) {
    $scope.message = message;
  };

}]);

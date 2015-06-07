App.controller("navbar", ["$scope", "searchTerm", function($scope, searchTerm) {
  $scope.$watch('[search]', function() {
    searchTerm.set($scope.search);
  }, true);
}])
.factory("searchTerm", function() {
  return {
    set: function(term) {
      this.filter = term;
    }
  };
});
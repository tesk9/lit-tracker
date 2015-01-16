Query.getAllBooks(function(book) {
  View.labelSvg(book);  
  Query.getBookRankings(book, function(data, bookID) {
    View.callGraph(data, bookID);
  });
});
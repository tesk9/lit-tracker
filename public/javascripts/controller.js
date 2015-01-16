Query.getAllBooks(function(book) {
  View.labelSvg(book);
  Query.getBookUrls(book, function(data, bookID) {
    View.callGraph(data, bookID);
  });
});
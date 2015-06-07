App.service("grapher", function() {
  return function(data, bookID) {
    if (data.length >= 2) {
      Grapher.InitLineChart(data, bookID);
    } else {
      $("#visualization" + bookID).append("<p class='text-center'>We don't have enough data yet. Please revisit this page later.</p>")
    }
  };
});

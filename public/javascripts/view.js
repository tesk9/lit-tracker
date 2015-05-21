var View = (function() {
  var callGraph = function(data, bookID) {
    if (data.length >= 2) {
      Grapher.InitLineChart(data, bookID);
    } else {
      $("#visualization" + bookID).append("<p class='text-center'>We don't have enough data yet. Please revisit this page later.</p>")
    }
  };

  var labelSvg = function(v) {
    $(".svgHolder").append("<div class='container' id='visualization" + String(v.book_id) + "'><div class='text-center'><h3><em><strong>" + _.escape(v.name) + "</strong></em> by " + _.escape(v.author) + "</h3></div></div><br><hr><br>");
  };

  return {
    callGraph: callGraph,
    labelSvg: labelSvg
  };
  
})();
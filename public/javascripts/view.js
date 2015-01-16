var View = (function() {
  var callGraph = function(data, bookID) {
    if (data.length >= 2) {
      console.log(data)
      Grapher.InitLineChart(data, bookID);
    } else {
      $("#visualization" + bookID).append("<p class='text-center'>We don't have enough data yet. Please revisit this page later.</p>")
    }
  }

  var labelSvg = function(v) {
    $(".svgHolder").append("<div class='container'><div class='text-center'><h3><em><strong>"+v.name+"</strong></em> by "+v.author+"</h3></div></div><div id='visualization"+String(v.book_id)+"'></div><br><hr><br>")
  }

  return {
    callGraph: callGraph,
    labelSvg: labelSvg
  }
  
})();
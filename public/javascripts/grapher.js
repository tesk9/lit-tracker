var InitLineChart = function(lineData, book_id) {
  var vis = d3.select('#visualization'+book_id),
      WIDTH = 1000,
      HEIGHT = 500,
      MARGINS = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 100
      },
      xAxisData = lineData.map(function(v,i,a) { return Date.parse(v.date); }),
      xRange = d3.time.scale().range([MARGINS.left, WIDTH - MARGINS.right]).domain([xAxisData[0], xAxisData[xAxisData.length-1]]),
      yRange = d3.scale.linear().range([MARGINS.bottom, HEIGHT - MARGINS.top]).domain([d3.min(lineData, function(d) {
        return d.ranking;
      }), d3.max(lineData, function(d) {
        return d.ranking;
      })]),
      xAxis = d3.svg.axis()
        .scale(xRange)
        .tickSize(1)
        .orient('bottom')
        .tickSubdivide(true),
      yAxis = d3.svg.axis()
        .scale(yRange)
        .tickSize(1)
        .orient('left')
        .tickSubdivide(true);

  vis.append('svg:g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
    .call(xAxis);

  vis.append('text')
    .attr("transform", "translate(" + WIDTH/2 + " ," + (HEIGHT + MARGINS.bottom) + ")")
    .style("text-anchor", "middle")
    .text("Date");
   
  vis.append('svg:g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
    .call(yAxis);

  var lineFunc = d3.svg.line()
    .x(function(d) {
      return xRange(Date.parse(d.date));
    })
    .y(function(d) {
      return yRange(d.ranking);
    })
    .interpolate('linear');

  vis.append('svg:path')
    .attr('d', lineFunc(lineData))
    .attr('stroke', 'blue')
    .attr('stroke-width', 2)
    .attr('fill', 'none');
};

$.get('/urls', function(books) {
  var books = JSON.parse(books.books);
  books.forEach(function(v,i,a) {
    $(".svgHolder").append("<div class='container'><div class='starter-template'><h2>"+v.name+"</h2><h3><em>by </em>"+v.author+"</h3></div></div><svg id='visualization"+String(v.book_id)+"' width='1000' height='500'></svg><br><hr><br>")
    $.get('/urls/' + v.book_id, function(data) {
      var data = JSON.parse(data.rankings);
      InitLineChart(data, v.book_id);
    });
  })
})

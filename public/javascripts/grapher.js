var InitLineChart = function(lineData, book_id) {
  var MARGINS = {
        top: 20,
        right: 20,
        bottom: 40,
        left: 100
      }
  WIDTH = 1000 - MARGINS.left - MARGINS.right, 
  HEIGHT = 500 - MARGINS.top - MARGINS.bottom,
  
  // select DOM element and append svg element
  vis = d3.select('#visualization'+book_id)
    .append("svg")
      .attr("width", WIDTH + MARGINS.left + MARGINS.right)
      .attr("height", HEIGHT + MARGINS.top + MARGINS.bottom)
    .append("g")
      .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")"),

  // get all dates in data set
  xAxisData = lineData.map(function(v,i,a) { return Date.parse(v.date); }),
  
  // define data ranges with .scale
  xRange = d3.time.scale().range([0, WIDTH]).domain([xAxisData[0], xAxisData[xAxisData.length-1]]),
  yRange = d3.scale.linear().range([0, HEIGHT]).domain([d3.min(lineData, function(d) {
    return d.ranking;
  }), d3.max(lineData, function(d) {
    return d.ranking;
  })]),

  // define axes
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

  // append x-axis
  vis.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + HEIGHT+ ')')
    .call(xAxis);

  // append x label
  vis.append('text')
    .attr("x", WIDTH / 2 )
    .attr("y",  HEIGHT + MARGINS.bottom )    
    .style("text-anchor", "middle")
    .text("Date");
   
  // append y-xis
  vis.append('g')
    .attr('class', 'y axis')
    .call(yAxis);

  // append y abel
  vis.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - (HEIGHT / 2))
    .attr("y", 0 - 4 * MARGINS.left / 5)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Amazon Sales Ranking");

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

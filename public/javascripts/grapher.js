var Grapher = (function() {
  var process = function(data) {
    var y = {};
    var urlHolder = [];
    var urlEditions = [];
    data.forEach(function(v) {
      if(y[v.url_id] !== undefined) {
        y[v.url_id].push({date: v.date, ranking: v.ranking});
      } else {
        y[v.url_id] = [{date: v.date, ranking: v.ranking}];
        urlHolder.push(v.url_id);
        urlEditions.push(v.edition);
      }
    })
    var yArr = [];
    urlHolder.forEach(function(url_id) {
      yArr.push(y[url_id]);
    })
    return [yArr, urlHolder, urlEditions]
  }

  var yRangeOptions = function(yData) {
    var ranges = [];
    yData.forEach(function(v) {
      ranges.push({
      range:  [ d3.min(v, function(d) {
            return d.ranking;
          }), d3.max(v, function(d) {
            return d.ranking;
          })
        ],
      show: true
      });
    });
    return ranges;
  }

  // get ranges in sales ranking for each edition
  var buildRanges = function(ranges) {
    var allRanges = []
    ranges.forEach(function(v) {
      if(v.show) {
        allRanges.push(v.range[0]);
        allRanges.push(v.range[1]);
      }
    });

    // If none of the editions are selected, avoid D3 path error by
    //   setting first range to default range
    if(allRanges.length == 0) {
      allRanges = [ranges[0].range[0], ranges[1].range[1]];
    }

    var yLow = Math.min.apply(null, allRanges);
    var yHigh = Math.max.apply(null, allRanges);
    return [yLow, yHigh];
  }

  var InitLineChart = function(lineData, book_id) {
    var hideLine = function(d,i) {
      var elem = d3.select("#url-"+urlIDs[i]);
      var newOpacity = (elem.style("opacity") == 0) ? 1 : 0;
      elem.transition().duration(700).style("opacity", newOpacity);
    };

    var massagedData = process(lineData),
    yData = massagedData[0], urlIDs = massagedData[1], urlEditions = massagedData[2],

    allRanges = yRangeOptions(yData),
    ranges = buildRanges(allRanges),
    
    colors = [
      'steelblue',
      'green',
      'red',
      'purple'
    ],

    MARGINS = {
          top: 30,
          right: 20,
          bottom: 40,
          left: 100
        },

    WIDTH = 1000 - MARGINS.left - MARGINS.right, 
    HEIGHT = 500 - MARGINS.top - MARGINS.bottom,
    
    // select DOM element and append svg element
    vis = d3.select('#visualization'+book_id)
      .append("div")
        .style("width", WIDTH + MARGINS.left + MARGINS.right + 70 + "px")
        .style("margin", "0px auto")
      .append("svg")
        .attr("width", WIDTH + MARGINS.left + MARGINS.right)
        .attr("height", HEIGHT + MARGINS.top + MARGINS.bottom)
      .append("g")
        .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")")
        .attr("id", "g-"+book_id),

    // get all dates in data set
    xAxisData = lineData.map(function(v,i,a) { return Date.parse(v.date); }),
    
    // scales
    xScale = d3.time.scale().range([0, WIDTH]),
    yScale = d3.scale.linear().range([0, HEIGHT]),

    // initial ranges
    xRange = xScale.domain([xAxisData[0], xAxisData[xAxisData.length-1]]),
    yRange = yScale.domain([ranges[0], ranges[1]]),

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
      .attr('class', 'xaxis')
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
      .attr('class', 'yaxis')
      .call(yAxis);

    // append y label
    vis.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0 - (HEIGHT / 2))
      .attr("y", 0 - 4 * MARGINS.left / 5)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Sales Ranking");

    // append title
    vis.append("text")
      .attr("x", (WIDTH / 2))             
      .attr("y", 0 - (MARGINS.top / 2))
      .attr("text-anchor", "middle")  
      .style("font-size", "16px") 
      .style("text-decoration", "underline")  
      .text("Amazon Sales Ranking versus Date");

    // append legend
    var legend = vis.append("g")
      .attr("class", "legend")
      .attr("height", 100)
      .attr("width", 100)
      .attr("transform", "translate(-20,50)");

    legend.selectAll('rect')
      .data(yData)
      .enter()
      .append("rect")
      .attr("x", WIDTH - 65 - 100)
      .attr("y", function(d,i) {
        return i*20;
      })
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", function(d,i) {
        return colors[i%colors.length];
      })
      .on("click", function(d,i) {
        rescale(d,i);
      });

    legend.selectAll('text')
      .data(yData)
      .enter()
      .append("text")
      .attr("x", WIDTH - 52 - 100)
      .attr("y", function(d,i) {
        return i*20 + 9;
      })
      .text(function(d,i) {
        return urlEditions[i];
      })
      .on("click", function(d,i) {
        rescale(d,i);
      });

    function rescale (d,i) {
      allRanges[i].show = (allRanges[i].show == true) ? false : true;
      ranges = buildRanges(allRanges);
      yRange = yScale.domain([ranges[0], ranges[1]]);

      // construct new lines according to new scale
      var redoLine = d3.svg.line()
        .x(function(d) {
          return xRange(Date.parse(d.date));
        })
        .y(function(d) {
          return yRange(d.ranking);
        })
        .interpolate('linear');

      // set up transitions
      trans = d3.select("#g-"+book_id).transition();

      // transition to new lines
      yData.forEach(function(v,i) {
        trans.selectAll("#url-"+urlIDs[i])
          .duration(1500)
          .attr("d", redoLine(v))
      });
      trans.select(".yaxis").duration(1500).call(yAxis);
      hideLine(d,i);
    }


    var appendLine = function(inputData, i) {
      var lineFunc = d3.svg.line()
        .x(function(d) {
          return xRange(Date.parse(d.date));
        })
        .y(function(d) {
          return yRange(d.ranking);
        })
        .interpolate('linear');

      vis.append('svg:path')
        .attr('stroke', colors[i%colors.length])
        .attr('d', lineFunc(inputData))
        .attr('id', "url-"+urlIDs[i])
        .attr('stroke-width', 2)
        .attr('fill', 'none');
    }

    yData.forEach(function(v,i) {
      appendLine(v,i);
    });
  };


  return {
    InitLineChart: InitLineChart
  }
  
})();

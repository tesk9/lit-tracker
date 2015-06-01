var http = require('http');

// Helper function for scraper
var download = function(url, callback) {
  http.get(url, function(res) {
  var data = "";
  res.on("data", function(chunk) {
      data += chunk;
    });

    res.on("end", function() {
      callback(data);
    });
  }).on("error", function(e) {
    console.log("Error: " + e.message);
  });
};

module.exports = download;
var $ = require('jquery')(require('jsdom').jsdom().parentWindow);
var db = require('../db/bookRankings.js');
var download = require('../utils/utils.js');

module.exports = (function() {
  // Standardize number format
  var cleanUpInt = function(numStr) {
    return numStr.replace(/\,/g, '');
  };

  // Amazon Scraper
  var getCurrentRankings = function() {
    db.getAllBooks(function(result) {
      var books = result;  
      books.forEach(function(book) {
        db.getBookURLs({ book_id: book.book_id }, function(urls) {
          urls.forEach(function(v) {
            download(v.url, function(data) {
              scrape(v, data);
            });
          })
        })
      });
    });
  };

  var scrape = function(url, data) {
    if (data) {
      var $data = $($.parseHTML(data));
      var sales = $data.find("#SalesRank").text();
      var start = sales.indexOf("#") + 1;
      sales = sales.slice(start);
      var end = sales.indexOf(" ");
      sales = sales.slice(0, end);
      sales = cleanUpInt(sales);
      var time = new Date();
      db.addRanking({url_id: url.url_id, ranking: sales, date: time});
    }
  };

  setInterval(getCurrentRankings, 200000);

  return {
    scrape: scrape
  };
})();

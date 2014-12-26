//AMAZON:
console.log("Scraper JS loaded")

$.ajax({
  url: "http://www.amazon.com/Yes-Please-Amy-Poehler/dp/0062268341/ref=tmm_hrd_swatch_0?_encoding=UTF8&sr=1-1&qid=1419636038.html",
  dataType: 'text',
  success: function(data) {
    var sales = data.find("#SalesRank").text();
    var start = sales.indexOf("#");
    sales = sales.slice(start+1);
    var end = sales.indexOf(" ");
    sales = sales.slice(0, end);
    console.log("Sales Ranking: ")
    console.log(sales);
  }
})

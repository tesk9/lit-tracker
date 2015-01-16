$(document).ready(function() {

  // new-book form submit:
  $("#submit").on('click', function(e) {
    console.log("button clicked")
    addBook();
  });
  $("#new-book-url").on('keyup', function(e) {
    if (e.keyCode==13) {
      addBook();
    }
  })

})

// verify data existence/types and POST data to server
var addBook = function() {
  var $title = $("#new-book-name").val(),
      $auth = $("#new-book-author").val(),
      $url = $("#new-book-url").val();
  if (!$title || !$auth || !$url) {
    errMessage("All fields required.");
    return;
  } else if (!$url.match(/^http:\/\/www.amazon.com\//)) {
    errMessage("Please input an amazon url.");
    return;
  }

  // errMessage("Adding books disabled. Please try again later.")

  $.ajax({
    url: '/new',
    type: 'POST',
    data: { name: $title,
            author: $auth,
            url: $url
          },
    success: function(r) {
      var data = JSON.parse(r.book);
      console.log("Post Book Status: " + r.status)
      $("#formHolder").prepend("<p>"+data.name+" by "+data.author+" has been added.</p>")
      $("#new-book-name").val("");
      $("#new-book-author").val("");
      $("#new-book-url").val("");
    }
    });

};

var errMessage = function(err) {
  $("#formHolder").find("span:nth-of-type(2)").remove();
  $("#formHolder").append("<span class='text-error'> "+err+"</span>");
};

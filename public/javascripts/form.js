$(document).ready(function() {
  $("#submit").on('click', function(e) {
    addBook();
  });
  $("#new-book-url").on('keyup', function(e) {
    if (e.keyCode==13) {
      addBook();
    }
  })
})

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

  $.ajax({
    url: '/new',
    type: 'POST',
    data: { name: $title,
            author: $auth,
            url: $url
          }
    });

};

var errMessage = function(err) {
  $("#formHolder").find("span").remove();
  $("#formHolder").append("<span class='text-error'>"+err+"</span>");
};

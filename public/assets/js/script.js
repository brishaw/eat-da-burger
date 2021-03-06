// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {
  registerPartial("burger-block", "#burgers-block-partial");
  displayPage();
  setupEventHandlers();
});

function registerPartial(name, partialId) {
  console.log("name " + name);
  console.log("partialID " + partialId)
  var source = $(partialId).text();
  Handlebars.registerPartial(name, source);
  console.log("source" + source);
}

function displayPage() {
  // Send the GET request.
  $.get("/api/burgers/").then(
    function(burgers) {
      renderTemplate({burgers: burgers});
    }
  );
}

function renderTemplate(data) {
  var source = $("#page-template").text();
  var template = Handlebars.compile(source);
  var html = template(data);
  $("#app").html(html);
}

function setupEventHandlers() {
  $(document).on("click", ".change-devour", function(event) {
    var id = $(this).data("id");
    var newDevour = $(this).data("newdevour");

    var newDevourState = {
      devoured: newDevour
    };

    // Send the PUT request.
    $.ajax("/api/burgers/" + id, {
      type: "PUT",
      data: newDevourState
    }).then(
      function() {
        console.log("changed devour to", newDevour);
        // Rerender the templates with the updated list
        displayPage();
      }
    );
  });

  $(document).on("submit", ".create-form", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    var newBurger = {
      name: $("#ca").val().trim(),
      devoured: $("[name=devoured]:checked").val().trim()
    };

    // Send the POST request.
    $.ajax("/api/burgers", {
      type: "POST",
      data: newBurger
    }).then(
      function() {
        console.log("created new burger");
        // Rerender the templates with the updated list
        displayPage();
      }
    );
  });

  $(document).on("click", ".delete-burger", function(event) {
    var id = $(this).data("id");

    // Send the DELETE request.
    $.ajax("/api/burgers/" + id, {
      type: "DELETE"
    }).then(
      function() {
        console.log("deleted burger", id);
        // Rerender the templates with the updated list
        displayPage();
      }
    );
  });
};

// *****

// Add smooth scrolling to all links
$("a").on('click', function (event) {

  // Make sure this.hash has a value before overriding default behavior
  if (this.hash !== "") {
    // Prevent default anchor click behavior
    event.preventDefault();

    // Store hash
    var hash = this.hash;

    // Using jQuery's animate() method to add smooth page scroll
    // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
    $('html, body').animate({
      scrollTop: $(hash).offset().top
    }, 800, function () {

      // Add hash (#) to URL when done scrolling (default click behavior)
      window.location.hash = hash;
    });
  } // End if
});

// *****

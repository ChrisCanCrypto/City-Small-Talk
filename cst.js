function handleSearch() {
  $("#zip-input").keyup(function(event) {
    var zipField = $(this).val();

    if (zipField.length == 5) {
      $.getJSON("csvjson.json", function(data) {
        $.each(data, function(key, value) {
          if (zipField == value.zip) {
            $("#city-input").val(value.city);
            $("#state-input").val(value.state_name);
          }
        });
      });
    }
  });
}

function handleCST() {
  handleSearch();
}

$(handleCST);

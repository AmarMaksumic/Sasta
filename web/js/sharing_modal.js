function init_share_modal() {
  var modal = document.getElementById("sharing_modal");

  // Get the button that opens the modal
  var btn = document.getElementById("sharing_settings");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[1];

  // When the user clicks on the button, open the modal
  btn.onclick = function() {
    modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }

  document.getElementById('close_settings_modal').onclick = function() {
    modal.style.display = "none";
  }
}

function get_shareable_link() {
  request_view_link();
}
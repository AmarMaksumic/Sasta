function init_share_modal() {
  var modal = document.getElementById("sharing_modal");

  // Get the button that opens the modal
  var btn = document.getElementById("sharing_settings");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[1];

  // When the user clicks on the button, open the modal
  btn.onclick = function() {
    document.getElementById('submit_edit_individual').style.display = 'none';
    document.getElementById('submit_add_individual').style.display = 'none';
    document.getElementById('delete_individual').style.display = 'none';
    document.getElementById('cancel_action').style.display = 'none';
    document.getElementById('close_settings_modal').style.display = 'inline-block';
    document.getElementById('add_individual').style.display = 'inline-block';
    modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
    document.getElementById('search_for_edit').style.display = 'block';
    document.getElementById('edit_individual').style.display = 'none';
  }

  document.getElementById('close_settings_modal').onclick = function() {
    modal.style.display = "none";
    document.getElementById('search_for_edit').style.display = 'block';
    document.getElementById('edit_individual').style.display = 'none';
  }


  document.getElementById('cancel_action').onclick = function() {
    document.getElementById('submit_edit_individual').style.display = 'none';
    document.getElementById('submit_add_individual').style.display = 'none';
    document.getElementById('delete_individual').style.display = 'none';
    document.getElementById('cancel_action').style.display = 'none';
    document.getElementById('close_settings_modal').style.display = 'inline-block';
    document.getElementById('add_individual').style.display = 'inline-block';
    document.getElementById('search_for_edit').style.display = 'block';
    document.getElementById('edit_individual').style.display = 'none';
  }

  document.getElementById('add_individual').onclick = function() {add_individual()}

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
      document.getElementById('search_for_edit').style.display = 'block';
      document.getElementById('edit_individual').style.display = 'none';
    }
  }
}
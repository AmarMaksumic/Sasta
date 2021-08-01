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

  document.getElementById('get_shareable_link').onclick = function() {
    get_shareable_link();
  }

  document.getElementById('close_settings_modal').onclick = function() {
    modal.style.display = "none";
  }
}

async function get_shareable_link() {
  uuid_code = await request_view_link();

  link = String(window.location.href).replace('topology', 'link');

  link += '?gfdd=' + localStorage.getItem('current_tree') + '&dldd=' + uuid_code;

  document.getElementById('get_shareable_link').remove();
  document.getElementById('shareable_link_container').style.display = 'block';
  document.getElementById('shareable_link').innerHTML = link;

  document.getElementById('shareable_link').onclick = function() {
    let text = link;
    console.log(text)
          navigator.clipboard.writeText(text)
            .then(() => {
              alert('Text copied to clipboard');
            })
            .catch(err => {
              alert('Error in copying text: ', err);
            });
  }
}
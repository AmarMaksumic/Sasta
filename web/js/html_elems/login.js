// AJAX function to handle logging in through the VeZa server.
function formSubmit(event) {
  // Create a new POST request towards the server.
  var url = "https://VeZa-Server.amarmaks.repl.co/login";
  var request = new XMLHttpRequest();
  request.open('POST', url, true);
  request.onload = function() { 
    // if the server responds / request successful
    // check that login access was granted.
    if (request.responseText == 'denied') {
      window.alert('Wrong username or password');
    } else {
      let user_uuid = JSON.parse(request.responseText);
      localStorage.setItem('user', user_uuid['user']);
      localStorage.setItem('trees', user_uuid['trees']);
      localStorage.setItem('uuid', user_uuid['uuid']);
      localStorage.setItem('logged_in', true);
      navbar_hide(false);
      switchTab(2);
    }
  };

  request.onerror = function() {
    // request failed
  };

  // create FormData from form that triggered event
  request.send(new FormData(event.target)); 
  event.preventDefault();
}

function attachFormSubmitEvent(formId){
  document.getElementById(formId).addEventListener("submit", formSubmit);
}

// If the user is logged in, redirect them to the main portal.
// Otherwise, they will be thrown to the login page.
if (login_status()) {
  navbar_hide(false);
  switchTab(2)
}

attachFormSubmitEvent("login");
function formSubmit(event) {
  var url = "https://VeZa-Server.amarmaks.repl.co/login";
  var request = new XMLHttpRequest();
  request.open('POST', url, true);
  request.onload = function() { // request successful
    if (request.responseText == 'denied') {
      window.alert('Wrong username or password');
    }
    console.log(request.responseText);
    let user_uuid = JSON.parse(request.responseText);
    localStorage.setItem('user', user_uuid['user']);
    localStorage.setItem('trees', user_uuid['trees']);
    localStorage.setItem('uuid', user_uuid['uuid']);
    localStorage.setItem('logged_in', true);
    window.location = 'portal.html';
  };

  request.onerror = function() {
    // request failed
  };

  request.send(new FormData(event.target)); // create FormData from form that triggered event
  event.preventDefault();
}

function attachFormSubmitEvent(formId){
  document.getElementById(formId).addEventListener("submit", formSubmit);
}

function load_page() {
  if (login_status()) window.location = 'portal.html';
}

attachFormSubmitEvent("login");
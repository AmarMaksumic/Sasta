function login_status() {
  if (localStorage.getItem('logged_in') == false || 
      localStorage.getItem('logged_in') == null || 
      is_logged_server()) return false;
  return true;
}

function is_logged_server() {
  var url = "https://VeZa-Server.amarmaks.repl.co/is_logged";
  var request = new XMLHttpRequest();
  request.open('POST', url, true);

  request.onload = function() { // request successful
    console.log(request.responseText)
    if (request.responseText == 'False') {
      localStorage.clear();
      window.location = 'login.html';
    }
  };

  request.onerror = function() {
    // request failed
  };

  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send(JSON.stringify({'username': localStorage.getItem('user'), 'uuid': localStorage.getItem('uuid')})); // create FormData from form that triggered event
  event.preventDefault();
}

function signout() {
  var url = "https://VeZa-Server.amarmaks.repl.co/signout";
  var request = new XMLHttpRequest();
  request.open('POST', url, true);
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send(JSON.stringify({'username': localStorage.getItem('user')})); // create FormData from form that triggered event
  event.preventDefault();
  localStorage.clear();
  window.location = 'login.html';
}

function request_tree(tree) {
  if (!login_status()) window.location = 'login.html';
  
  var url = "https://VeZa-Server.amarmaks.repl.co/request_tree";
  var request = new XMLHttpRequest();
  request.open('POST', url, true);

  request.onload = function() { // request successful
    if (request.responseText != 'denied') {
      localStorage.setItem('current_tree_data', request.responseText);
      localStorage.setItem('current_tree', tree);
      localStorage.setItem('view_only', false);
      window.location = 'topology.html';
    }
    console.log(request.responseText);
  };

  request.onerror = function() {
    // request failed
  };

  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send(JSON.stringify({'username': localStorage.getItem('user'), 'uuid': localStorage.getItem('uuid'), 'tree': tree})); // create FormData from form that triggered event
  event.preventDefault();
}

function request_tree_view(tree, access_code) {  
  var url = "https://VeZa-Server.amarmaks.repl.co/request_tree_view";
  var request = new XMLHttpRequest();
  request.open('POST', url, true);

  request.onload = function() { // request successful
    if (request.responseText != 'denied') {
      localStorage.setItem('current_tree_data', request.responseText);
      localStorage.setItem('current_tree', tree);
      localStorage.setItem('view_only', true);
      localStorage.setItem('current_individual', 'no_curr')
      window.location = 'topology.html';
    } else {
      window.alert('invalid link');
    }
    console.log(request.responseText);
  };

  request.onerror = function() {
    // request failed
  };

  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send(JSON.stringify({'tree': tree, 'access_code': access_code})); // create FormData from form that triggered event
  event.preventDefault();
}

function request_edit(individual, data) {  
  var url = "https://VeZa-Server.amarmaks.repl.co/request_edit";
  var request = new XMLHttpRequest();
  request.open('POST', url, true);

  request.onload = function() { // request successful
    console.log(request.responseText);
  };

  request.onerror = function() {
    // request failed
  };

  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send(JSON.stringify({'username': localStorage.getItem('user'), 'individual': individual, 'new_data': data, 'tree': localStorage.getItem('current_tree')})); // create FormData from form that triggered event
  event.preventDefault();
}

function request_add(data) {  
  var url = "https://VeZa-Server.amarmaks.repl.co/request_add";
  var request = new XMLHttpRequest();
  request.open('POST', url, true);

  request.onload = function() { // request successful
    console.log(request.responseText);
  };

  request.onerror = function() {
    // request failed
  };

  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send(JSON.stringify({'username': localStorage.getItem('user'), 'new_data': data, 'tree': localStorage.getItem('current_tree')})); // create FormData from form that triggered event
  event.preventDefault();
}

function request_view_link() {
  var url = "https://VeZa-Server.amarmaks.repl.co/request_view_link";
  var request = new XMLHttpRequest();
  request.open('POST', url, true);

  request.onload = function() { // request successful
    console.log(request.responseText);
    return request.responseText;
  };

  request.onerror = function() {
    // request failed
  };

  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send(JSON.stringify({'username': localStorage.getItem('user'), 'uuid': localStorage.getItem('uuid'), 'tree': localStorage.getItem('current_tree')})); // create FormData from form that triggered event
  event.preventDefault();
}
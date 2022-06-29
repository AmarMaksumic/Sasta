// Helper function to check if user is logged in.
// Log in status should be set to true on the client side,
// and the server should have a valid session open.
function login_status() {
  if (localStorage.getItem('logged_in') == false || 
      localStorage.getItem('logged_in') == null || 
      is_logged_server()) {
        navbar_hide(true);
        return false;
      }
  navbar_hide(false);
  return true;
}

// Function to check login status on server side.
// If the client is not logged in, the function
// automatically clears any local data
// (login UUID, family trees, etc) and redirects
// to the login page.
function is_logged_server() {
  var url = "https://VeZa-Server.amarmaks.repl.co/is_logged";
  var request = new XMLHttpRequest();
  request.open('POST', url, true);

  request.onload = function() {
    console.log('test')
    if (request.responseText == 'False') {
      localStorage.clear();
      switchTab(4)
      navbar_hide(true);
    }
  };

  request.onerror = function() {
    // request failed
  };

  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send(JSON.stringify({'username': localStorage.getItem('user'), 'uuid': localStorage.getItem('uuid')})); // create FormData from form that triggered event
  event.preventDefault();
}

// Function to log the user out on the client side
// (clear any local data like login UUID, family
// trees, etc) and retire their session on the server.
function signout() {
  var url = "https://VeZa-Server.amarmaks.repl.co/signout";
  var request = new XMLHttpRequest();
  request.open('POST', url, true);
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send(JSON.stringify({'username': localStorage.getItem('user')})); // create FormData from form that triggered event
  event.preventDefault();
  localStorage.clear();
  switchTab(4)
  navbar_hide(true);
}

// Function to request data from a specific family tree.
// If the request is verified, stores the data in 
// local storage.
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
      switchTab(63);
    }
  };

  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send(JSON.stringify({'username': localStorage.getItem('user'), 'uuid': localStorage.getItem('uuid'), 'tree': tree})); // create FormData from form that triggered event
  event.preventDefault();
}

// Function to request data from a specific family tree.
// FOR VIEWING PURPOSES ONLY.
// If the request is verified, stores the data in 
// local storage.
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

  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send(JSON.stringify({'tree': tree, 'access_code': access_code})); // create FormData from form that triggered event
  event.preventDefault();
}

// Function to request an edit to a family tree.
function request_edit(individual, data) {  
  return new Promise(function(resolve, reject) {
    var url = "https://VeZa-Server.amarmaks.repl.co/request_edit";
    var request = new XMLHttpRequest();
    request.open('POST', url, true);

    request.onload = function() { // request successful
      resolve(request.responseText);
    };

    request.onerror = function() {
      reject(request.responseText);
    };

    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({'username': localStorage.getItem('user'), 'individual': individual, 'new_data': data[0], 'link_data': data[1], 'tree': localStorage.getItem('current_tree')})); // create FormData from form that triggered event
    event.preventDefault();
  })
}

// Function to request a member addition to a family tree.
function request_add(data) {  
  var url = "https://VeZa-Server.amarmaks.repl.co/request_add";
  var request = new XMLHttpRequest();
  request.open('POST', url, true);
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send(JSON.stringify({'username': localStorage.getItem('user'), 'new_data': data[0], 'link_data': data[1], 'tree': localStorage.getItem('current_tree')})); // create FormData from form that triggered event
  event.preventDefault();
}

// Function to request a view link to a family tree.
function request_view_link() {
  return new Promise(function(resolve, reject) {

    if (!login_status()) window.location = 'login.html';
    var url = "https://VeZa-Server.amarmaks.repl.co/request_view_link";
    var request = new XMLHttpRequest();
    request.open('POST', url, true);

    request.onload = function() {
      resolve(request.responseText);
    };

    request.onerror = function() {
      reject('denied');
    };

    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({'username': localStorage.getItem('user'), 'uuid': localStorage.getItem('uuid'), 'tree': localStorage.getItem('current_tree')})); // create FormData from form that triggered event
    event.preventDefault();
  })
  
}
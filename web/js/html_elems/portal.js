// First function called on a page load for portal.html
function load_page() {
  // if not logged in, send back to the login page.
  if (!login_status()) window.location = 'login.html';

  // otherwise, load account data onto the page.
  document.getElementById('active_user').innerHTML = 'Current user: ' + localStorage.getItem('user');
  document.getElementById('active_trees').innerHTML = 'Family Trees: <br>'

  trees = localStorage.getItem('trees').split(',');
  localStorage.setItem('current_individual', 'no_curr');
  localStorage.setItem('show_edit_nodes', 'false');

  for (let i = 0; i < trees.length; i++) {
    let tree_button = document.createElement('button');
    console.log(trees[i])
    tree_button.id = 'tree_' + trees[i];
    tree_button.innerHTML = trees[i];
    tree_button.onclick = function() {
      request_tree(trees[i]);
    };
    document.getElementById('active_trees').appendChild(tree_button);
  }

}

load_page()
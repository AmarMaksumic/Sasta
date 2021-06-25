function load_page() {
  if (!login_status()) window.location = 'login.html';

  document.getElementById('active_user').innerHTML = 'Current user: ' + localStorage.getItem('user');
  document.getElementById('active_trees').innerHTML = 'Family Trees:'

  trees = localStorage.getItem('trees').split(',');
  localStorage.setItem('current_individual', 'no_curr');

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
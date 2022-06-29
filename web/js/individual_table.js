// Main function to render a table of individuals for either:
//   - Launching a search modal.
//   - Launching an edit modal.
function render_table (job) {
  let location = null;
  if (job == 'EDIT') location = 0;
  let tree_data = JSON.parse(localStorage.getItem('current_tree_data'));
  console.log(tree_data.individuals)

  let tree_table = document.createElement('TABLE');
  tree_table.setAttribute('class', 'individuals_table');

  for (id in tree_data.individuals[0]) {
    add_row(tree_table, full_name(tree_data.individuals[0][id]), 
            tree_data.individuals[0][id].DOB, id, location);
  }

  console.log(tree_table);

  document.getElementsByClassName('individual_list')[location].appendChild(tree_table);
}

// Helper function to create a cell in a row of data.
function add_cell(tr, value) {
  let td = document.createElement('td');
  
  td.innerHTML = value;

  tr.appendChild(td)

  delete td;
}

// Helper function to create a row in a table of data.
function add_row(table, name, dob, id, location) {
  let tr = document.createElement('tr');

  add_cell(tr, name);
  if (dob == '') dob= 'n/a';
  add_cell(tr, dob);
 
  if (location == 0) tr.onclick = function() {make_tree(id)};
  if (location == 1) tr.onclick = function() {edit_individual(id)};

  table.appendChild(tr);

  delete tr;
}

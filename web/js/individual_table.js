function render_table (job) {
  let location = null;
  if (job == 'SEARCH') location = 0;
  if (job == 'EDIT') location = 1;
  let tree_data = JSON.parse(localStorage.getItem('current_tree_data'));

  let tree_table = document.createElement('TABLE');
  tree_table.setAttribute('class', 'individuals_table');

  for (id in tree_data.individuals[0]) {
    addRow(tree_table, tree_data.individuals[0][id].Fname + ' ' + tree_data.individuals[0][id].Lname, tree_data.individuals[0][id].DOB, id, location)
  }

  console.log(tree_table);

  document.getElementsByClassName('individual_list')[location].appendChild(tree_table);
}

function addCell(tr, value) {
  let td = document.createElement('td');
  
  td.innerHTML = value;

  tr.appendChild(td)

  delete td;
}

function addRow(table, name, dob, id, location) {
  let tr = document.createElement('tr');

  addCell(tr, name);
  if (dob == '') dob= 'n/a';
  addCell(tr, dob);
 
  if (location == 0) tr.onclick = function() {make_tree(id)};
  if (location == 1) tr.onclick = function() {edit_individual(id)};

  table.appendChild(tr);

  delete tr;
}
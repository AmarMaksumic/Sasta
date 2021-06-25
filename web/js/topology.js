let total_num_marriages = null;

function load_page() {
  if (!login_status()) window.location = 'login.html';

  if (localStorage.getItem('current_individual') != 'no_curr') make_tree(localStorage.getItem('current_individual'));

  document.getElementById('active_tree').innerHTML = 'Current family tree: ' + localStorage.getItem('current_tree');

  render_table('SEARCH');
  render_table('EDIT')

  let tree_data = JSON.parse(localStorage.getItem('current_tree_data'));
  let individuals = tree_data.individuals[0];

  var modal = document.getElementById("edit_tree_modal");

  // Get the button that opens the modal
  var btn = document.getElementById("edit_tree");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on the button, open the modal
  btn.onclick = function() {
    document.getElementById('submit_edit_individual').style.display = 'none';
    document.getElementById('submit_add_individual').style.display = 'none';
    document.getElementById('delete_individual').style.display = 'none';
    document.getElementById('cancel_action').style.display = 'none';
    document.getElementById('close_modal').style.display = 'inline-block';
    document.getElementById('add_individual').style.display = 'inline-block';
    modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
    document.getElementById('search_for_edit').style.display = 'block';
    document.getElementById('edit_individual').style.display = 'none';
  }

  document.getElementById('close_modal').onclick = function() {
    modal.style.display = "none";
    document.getElementById('search_for_edit').style.display = 'block';
    document.getElementById('edit_individual').style.display = 'none';
  }


  document.getElementById('cancel_action').onclick = function() {
    document.getElementById('submit_edit_individual').style.display = 'none';
    document.getElementById('submit_add_individual').style.display = 'none';
    document.getElementById('delete_individual').style.display = 'none';
    document.getElementById('cancel_action').style.display = 'none';
    document.getElementById('close_modal').style.display = 'inline-block';
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

function render_table (job, for_id=null) {
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

function make_tree(id) {
  current_individual = id;
  localStorage.setItem('current_individual', current_individual);
  document.getElementById('family_tree').innerHTML = '';
  if (!login_status()) window.location = 'login.html';

  let tree_data = JSON.parse(localStorage.getItem('current_tree_data'));
  let tree = [];
  let individuals = tree_data.individuals[0];
  let individual = individuals[id];

  if (individual.Parent1 != null && individual.Parent1 != null) {
    tree.push({
                "name": full_name(individuals, individual.Parent1),
                "class": individuals[individual.Parent1].Gender,
                "textClass": null,
                "extra": individual.Parent1,
                "marriages": [{
                  "spouse": {
                    "name": full_name(individuals, individual.Parent2),
                    "class": individuals[individual.Parent2].Gender,
                    "textClass": null,
                    "extra": individual.Parent2
                  },
                  "children": []
                }]
              })
  } else if (individual.Parent1 != null) {
    tree.push({
                "name": full_name(individuals, individual.Parent1),
                "class": individuals[individual.Parent1].Gender,
                "textClass": null,
                "extra": individual.Parent1,
                "marriages": [{
                  "spouse": {
                    "name": "No 2nd parent",
                    "class": "none",
                    "textClass": null,
                  },
                  "children": []
                }]
              })
  } else {
    tree.push({
                "name": "No 1st parent",
                "class": "none",
                "textClass": null,
                "marriages": [{
                  "spouse": {
                    "name": "No 2nd parent",
                    "class": "none",
                    "textClass": null,
                  },
                  "children": []
                }]
              })
  }

  let siblings = tree[0].marriages[0].children;
  let siblings_length = individual.Siblings.length;
  let my_index = 1;
  
  if (siblings_length != 0) {
    for (let i = 0; i < siblings_length; i++) {
      siblings.push({
        "name": full_name(individuals, individual.Siblings[i]),
        "class": individuals[individual.Siblings[i]].Gender,
        "textClass": null,
        "extra": individual.Siblings[i]
      });
    }

    siblings.splice(Math.round(siblings_length/2), 0, {
                                                        "name": full_name(individuals, id),
                                                        "class": individual.Gender + " tree_center",
                                                        "textClass": null,
                                                        "extra": id,
                                                        "marriages": []
                                                      })
    
    my_index = Math.round(siblings_length/2);
  } else {
    siblings.push({
      "name": "No siblings",
      "class": "none",
      "textClass": null
    },
    {
      "name": full_name(individuals, id),
      "class": individual.Gender + " tree_center",
      "textClass": null,
      "extra": id,
      "marriages": []
    });
  }

  let me = tree[0].marriages[0].children[my_index]

  let spouse_length = individual.Spouse.length

  if (spouse_length != 0) {
    for (let i = 0; i < spouse_length; i++) {

      if (individual.Spouse[i] != null) {
        me.marriages.push({
          "spouse": {
            "name": full_name(individuals, individual.Spouse[i]),
            "class": individuals[individual.Spouse[i]].Gender,
            "textClass": null,
            "extra": individual.Spouse[i]
          }
        })
      } else {
        me.marriages.push({
          "spouse": {
            "name": "No spouse",
            "class": "none",
            "textClass": null
          }
        })
      }

      console.log(me)
      console.log(i)

      if (individual.Children[i] != null) {
        let children_length = individual.Children[i].length

        if (children_length != 0) {
          me.marriages[i].children = [];
          for (let j = 0; j < children_length; j++) {
            me.marriages[i].children.push({
                                            "name": full_name(individuals, individual.Children[i][j]),
                                            "class": individuals[individual.Children[i][j]].Gender,
                                            "textClass": null,
                                            "extra": individual.Children[i][j]
                                          })
          }
        }
      } else {
        me.marriages[i].children = [];
        me.marriages[i].children.push({
                                        "name": "No children",
                                        "class": "none",
                                        "textClass": null
                                      })
      }
    }
  } else {
    me.marriages.push({
      "spouse": {
        "name": "No spouse",
        "class": "none",
        "textClass": null
      },
      "children": [{
        "name": "No children",
        "class": "none",
        "textClass": null
      }]
    })
  }

  console.log(tree)

  d3_tree = dTree.init(tree, 
                        {target: "#family_tree", 
                        height: 800, 
                        width: 1200, 
                        callbacks: {
                          nodeClick: function(name, extra, id) {
                            if (extra != null) make_tree(extra);
                          },
                          nodeRightClick: function(name, extra, id) {
                            if (extra != null) {
                              document.getElementById("edit_tree_modal").style.display = "block";
                              edit_individual(extra);
                            }
                          }
                        }
                        });

  let center = document.getElementsByClassName('tree_center');
  
  console.log(center[0].id.substr(4))

  d3_tree.zoomToNode(parseInt(center[0].id.substr(4)), zoom=2, duartion = 0)
}

function full_name(individuals, id) {
  let name = '';
  if (individuals[id].Fname != null) {
    name += individuals[id].Fname + ' ';
  }
  if (individuals[id].Mname != null) {
    name += individuals[id].Mname + ' ';
  }
  if (individuals[id].Lname != null) {
    name += individuals[id].Lname;
  }
  return name;
}

function populate_dropdowns(id) {

  $('#Gender').chosen("destroy");
  $('#Parents').chosen("destroy");
  $('#Siblings').chosen("destroy");
  $('#Spouse_m1').chosen("destroy");
  $('#Children_m1').chosen("destroy");
  $('#Status_m1').chosen("destroy");

  del_marriage_drop(1, true);

  let tree_data = JSON.parse(localStorage.getItem('current_tree_data'));
  let individuals = tree_data.individuals[0];

  let search_drops = document.getElementsByClassName('dropsearch');

  for (let i = 0; i < search_drops.length; i++) {
    search_drops[i].innerHTML = '';
  }

  console.log(search_drops)
  for (person in individuals) {
    if (person != id) {
      let item = document.createElement('OPTION');
      item.setAttribute('name', person);
      item.setAttribute('value', person);
      item.innerHTML = full_name(individuals, person)
      for (let i = 0; i < search_drops.length; i++) {
        let clone = item.cloneNode(true);
        search_drops[i].append(clone);
      }
    }
  }

  console.log(search_drops);
  

  $('#Gender').chosen({
    no_results_text: "Oops, nothing found!",
    max_selected_options: 1,
    width: '310px',
    placeholder_text_multiple: 'Select an option'
  });

  $('#Parents').chosen({
    no_results_text: "Oops, nothing found!",
    max_selected_options: 2,
    width: '310px'
  });

  $('#Siblings').chosen({
    no_results_text: "Oops, nothing found!",
    width: '310px'
  });

  $('#Spouse_m1').chosen({
    no_results_text: "Oops, nothing found!",
    max_selected_options: 1,
    width: '310px',
    placeholder_text_multiple: 'Select an option'
  });

  $('#Children_m1').chosen({
    no_results_text: "Oops, nothing found!",
    width: '310px'
  });

  $('#Status_m1').chosen({
    no_results_text: "Oops, nothing found!",
    max_selected_options: 1,
    width: '310px',
    placeholder_text_multiple: 'Select an option'
  });
}

function populate_fields(id) {
  let tree_data = JSON.parse(localStorage.getItem('current_tree_data'));
  let individuals = tree_data.individuals[0];

  document.getElementById('current_individual').innerHTML = full_name(individuals, id);

  document.getElementById('Fname').value = individuals[id].Fname;
  document.getElementById('Mname').value = individuals[id].Mname;
  document.getElementById('Lname').value = individuals[id].Lname;
  document.getElementById('DOB').value = individuals[id].DOB;
  document.getElementById('DOD').value = individuals[id].DOD;

  $('#Gender').val([individuals[id].Gender]);
  $('#Gender').trigger('chosen:updated');

  $('#Parents').val([individuals[id].Parent1, individuals[id].Parent2]);
  $('#Parents').trigger('chosen:updated');

  let siblings_list = []

  for (let i = 0; i < individuals[id].Siblings.length; i++) {
    siblings_list.push(individuals[id].Siblings[i]);
  }

  $('#Siblings').val(siblings_list);
  $('#Siblings').trigger('chosen:updated');

  document.getElementById('Num_marriages').value = individuals[id].Num_marriages;

  if (individuals[id].Num_marriages == 0) {
    $('#Children_m1').val(individuals[id].Children[0]);
    $('#Children_m1').trigger('chosen:updated');

    
    $('#Spouse_m1').val([]);
    $('#Spouse_m1').trigger('chosen:updated');

    $('#Status_m1').val([]);
    $('#Status_m1').trigger('chosen:updated');

    total_num_marriages = 0;

    document.getElementById('Spouse_m1').disabled = true; 
    $('#Spouse_m1').prop('disabled', true).trigger("chosen:updated");
    document.getElementById('Status_m1').disabled = true; 
    $('#Status_m1').prop('disabled', true).trigger("chosen:updated");
  } else if (individuals[id].Num_marriages == 1) {
    $('#Children_m1').val(individuals[id].Children[0]);
    $('#Children_m1').trigger('chosen:updated');

    $('#Spouse_m1').val([individuals[id].Spouse[0]]);
    $('#Spouse_m1').trigger('chosen:updated');

    $('#Status_m1').val([individuals[id].Marriage_status[0]]);
    $('#Status_m1').trigger('chosen:updated');

    document.getElementById('Spouse_m1').disabled = false; 
    $('#Spouse_m1').prop('disabled', false).trigger("chosen:updated");
    document.getElementById('Status_m1').disabled = false; 
    $('#Status_m1').prop('disabled', false).trigger("chosen:updated");
    total_num_marriages = 1;
  } else {
    total_num_marriages = 0;
    new_marriage_drop(individuals[id].Num_marriages);
    total_num_marriages = individuals[id].Num_marriages;

    for (let i = 1; i <= individuals[id].Num_marriages; i++) {
      $('#Spouse_m' + i).val([individuals[id].Spouse[i - 1]]);
      $('#Spouse_m' + i).trigger('chosen:updated');
      $('#Children_m' + i).val(individuals[id].Children[i - 1]);
      $('#Children_m' + i).trigger('chosen:updated');
      $('#Status_m' + i).val([individuals[id].Marriage_status[i - 1]]);
      $('#Status_m' + i).trigger('chosen:updated');
    }
  }
}

function init_marriage_drop(num) {

  let search_drops = document.getElementById('m' + num).getElementsByClassName('dropsearch');
  let tree_data = JSON.parse(localStorage.getItem('current_tree_data'));
  let individuals = tree_data.individuals[0];

  for (let i = 0; i < search_drops.length; i++) {
    search_drops[i].innerHTML = '';
  }

  console.log(search_drops)
  for (person in individuals) {
    if (person != id) {
      let item = document.createElement('OPTION');
      item.setAttribute('name', person);
      item.setAttribute('value', person);
      item.innerHTML = full_name(individuals, person)
      for (let i = 0; i < search_drops.length; i++) {
        let clone = item.cloneNode(true);
        search_drops[i].append(clone);
      }
    }
  }

  $('#Spouse_m' + num).chosen({
    no_results_text: "Oops, nothing found!",
    max_selected_options: 1,
    width: '310px',
    placeholder_text_multiple: 'Select an option'
  });

  $('#Children_m' + num).chosen({
    no_results_text: "Oops, nothing found!",
    width: '310px'
  });

  $('#Status_m' + num).chosen({
    no_results_text: "Oops, nothing found!",
    max_selected_options: 1,
    width: '310px',
    placeholder_text_multiple: 'Select an option'
  });
}

function new_marriage_drop(new_num) {
  if (new_num == 1) {
    document.getElementById('Spouse_m1').disabled = false; 
    $('#Spouse_m1').prop('disabled', false).trigger("chosen:updated");
    document.getElementById('Status_m1').disabled = false; 
    $('#Status_m1').prop('disabled', false).trigger("chosen:updated");
  } else if (total_num_marriages == 0 && new_num > 1) {
    total_num_marriages+=2;
    document.getElementById('Spouse_m1').disabled = false; 
    $('#Spouse_m1').prop('disabled', false).trigger("chosen:updated");
    document.getElementById('Status_m1').disabled = false; 
    $('#Status_m1').prop('disabled', false).trigger("chosen:updated");
    let marriage_container = document.getElementById('extra_m');
    for (let i = total_num_marriages; i <= new_num; i++) {
      console.log(i)
      let marriage = `  <div id=m` + i + `>
                          <hr style="border-top: 1px dashed #bbb;">
                          <label for="Spouse_m` + i + `">Spouse for Marriage ` + i + `</label><br>
                          <select name="Spouse_m` + i + `" id="Spouse_m` + i + `" class="dropsearch" multiple></select><br><br>
                          <label for="Children_m` + i + `">Children for Marriage ` + i + `</label><br>
                          <select name="Children_m` + i + `" id="Children_m` + i + `" class="dropsearch" multiple></select><br><br>
                          <label for="Status_m` + i + `">Status for Marriage ` + i + `</label><br>
                          <select name="Status_m` + i + `" id="Status_m` + i + `" multiple>
                            <option value="1">Married</option>
                            <option value="2">Divorced</option>
                            <option value="3">Re-Married</option>
                          </select><br><br>
                        </div>
                        `
      marriage_container.innerHTML += marriage;
    }

    for (let i = total_num_marriages; i <= new_num; i++) {
      init_marriage_drop(i);
    }
  } else {
    total_num_marriages+=1;
    let marriage_container = document.getElementById('extra_m');
    for (let i = total_num_marriages; i <= new_num; i++) {
      console.log(i)
      let marriage = `  <div id=m` + i + `>
                          <hr style="border-top: 1px dashed #bbb;">
                          <label for="Spouse_m` + i + `">Spouse for Marriage ` + i + `</label><br>
                          <select name="Spouse_m` + i + `" id="Spouse_m` + i + `" class="dropsearch" multiple></select><br><br>
                          <label for="Children_m` + i + `">Children for Marriage ` + i + `</label><br>
                          <select name="Children_m` + i + `" id="Children_m` + i + `" class="dropsearch" multiple></select><br><br>
                          <label for="Status_m` + i + `">Status for Marriage ` + i + `</label><br>
                          <select name="Status_m` + i + `" id="Status_m` + i + `" multiple>
                            <option value="1">Married</option>
                            <option value="2">Divorced</option>
                            <option value="3">Re-Married</option>
                          </select><br><br>
                        </div>
                        `
      marriage_container.innerHTML += marriage;
    }

    for (let i = total_num_marriages; i <= new_num; i++) {
      init_marriage_drop(i);
    }
  }
}

function del_marriage_drop(new_num, should_del_all) {
  console.log('hi')
  if (should_del_all || new_num == 0) {
    document.getElementById('extra_m').innerHTML="";

    
    $('#Children_m1').val([]);
    $('#Children_m1').trigger('chosen:updated');

    
    $('#Spouse_m1').val([]);
    $('#Spouse_m1').trigger('chosen:updated');

    $('#Status_m1').val([]);
    $('#Status_m1').trigger('chosen:updated');

    total_num_marriages = 0;

    document.getElementById('Spouse_m1').disabled = true; 
    $('#Spouse_m1').prop('disabled', true).trigger("chosen:updated");
    document.getElementById('Status_m1').disabled = true; 
    $('#Status_m1').prop('disabled', true).trigger("chosen:updated");
  } else if (new_num == 1) {
    document.getElementById('extra_m').innerHTML="";
  } else {
    for (let i = total_num_marriages; i > new_num; i--) {
      document.getElementById('m' + i).remove();
    }
  }
}

function collect_add_data() {

  let tree_data = JSON.parse(localStorage.getItem('current_tree_data'));
  let individuals = tree_data.individuals[0];
  let individual = {};

  individual.Fname = document.getElementById('Fname').value;
  individual.Mname = document.getElementById('Mname').value;
  individual.Lname = document.getElementById('Lname').value;
  individual.DOB = document.getElementById('DOB').value;
  individual.DOD = document.getElementById('DOD').value;
  individual.Gender = document.getElementById('Gender').value;
  individual.Parent1 = $('#Parents').val()[0];
  individual.Parent2 = $('#Parents').val()[1];
  individual.Siblings = [];
  for (let i = 0; i < $('#Siblings').val().length; i++) {
    individual.Siblings.push($('#Siblings').val()[i]);
  }

  individual.Num_marriages = total_num_marriages;
  individual.Spouse = [];
  individual.Children = [];
  individual.Marriage_Status = [];

  for (let i = 1; i <= total_num_marriages; i++) { 
    individual.Spouse[i - 1] = $('#Spouse_m' + i).val()[0];
    individual.Children[i - 1] = $('#Children_m' + i).val();
    individual.Marriage_status[i - 1] = $('#Status_m' + i).val()[0];
  }

  
  individual.Extra = document.getElementById('Extra').value;

  console.log(individual)

  return individual;
}

function send_add_data() {
  request_add(collect_add_data());
  request_tree(localStorage.getItem('current_tree'));
}

function collect_edit_data(id) {

  let tree_data = JSON.parse(localStorage.getItem('current_tree_data'));
  let individuals = tree_data.individuals[0];
  let individual = individuals[id];

  individual.Fname = document.getElementById('Fname').value;
  individual.Mname = document.getElementById('Mname').value;
  individual.Lname = document.getElementById('Lname').value;
  individual.DOB = document.getElementById('DOB').value;
  individual.DOD = document.getElementById('DOD').value;
  individual.Gender = document.getElementById('Gender').value;
  individual.Parent1 = $('#Parents').val()[0];
  individual.Parent2 = $('#Parents').val()[1];
  individual.Siblings = [];
  for (let i = 0; i < $('#Siblings').val().length; i++) {
    individual.Siblings.push($('#Siblings').val()[i]);
  }

  individual.Num_marriages = total_num_marriages;

  for (let i = 1; i <= total_num_marriages; i++) { 
    individual.Spouse[i - 1] = $('#Spouse_m' + i).val()[0];
    individual.Children[i - 1] = $('#Children_m' + i).val();
    individual.Marriage_status[i - 1] = $('#Status_m' + i).val()[0];
  }

  individual.Extra = document.getElementById('Extra').value;

  console.log(individual)

  return individual;
}

function send_edit_data(id) {
  request_edit(id, collect_edit_data(id));
  request_tree(localStorage.getItem('current_tree'));
}

function edit_individual(id) {
  document.getElementById('submit_edit_individual').style.display = 'inline-block';
  document.getElementById('cancel_action').style.display = 'inline-block';
  document.getElementById('delete_individual').style.display = 'inline-block';
  document.getElementById('submit_add_individual').style.display = 'none';
  document.getElementById('add_individual').style.display = 'none';
  document.getElementById('close_modal').style.display = 'none';
  console.log(id)
  document.getElementById('search_for_edit').style.display = 'none';
  document.getElementById('edit_individual').style.display = 'block';

  populate_dropdowns(id);
  populate_fields(id);

  document.getElementById('Num_marriages').addEventListener('change', function() {
    if (this.value < total_num_marriages) del_marriage_drop(this.value, false);
    if (this.value > total_num_marriages) new_marriage_drop(this.value);
    total_num_marriages == this.value;
    console.log('done')
  })

  document.getElementById('submit_edit_individual').onclick = function() {
    send_edit_data(id);
  }

}

function add_individual() {
  document.getElementById('submit_edit_individual').style.display = 'none';
  document.getElementById('cancel_action').style.display = 'inline-block';
  document.getElementById('submit_add_individual').style.display = 'inline-block';
  document.getElementById('delete_individual').style.display = 'none';
  document.getElementById('add_individual').style.display = 'none';
  document.getElementById('close_modal').style.display = 'none';
  document.getElementById('search_for_edit').style.display = 'none';
  document.getElementById('edit_individual').style.display = 'block';

  populate_dropdowns(0);
  // populate_fields(id);

  document.getElementById('Num_marriages').value = 0;

  document.getElementById('submit_add_individual').onclick = function() {
    send_add_data();
  }
}

$(".reference_point").keyup(function() {

  // Retrieve the input field text and reset the count to zero
  var filter = $(this).val(),
    count = 0;

  console.log('hi')

  // Loop through the comment list
  $('.individuals_table tr').each(function() {

    console.log('hi')
    // If the list item does not contain the text phrase fade it out
    if ($(this).text().search(new RegExp(filter, "i")) < 0) {
      $(this).hide();  // MY CHANGE

      // Show the list item if the phrase matches and increase the count by 1
    } else {
      $(this).show(); // MY CHANGE
      count++;
    }

  });

});

$('#edit_form').keypress(function (e) {                                       
  if (e.which == 13) {
       e.preventDefault();
       //do something   
  }
});

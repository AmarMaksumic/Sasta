var total_num_marriages = 0;

function init_edit_modal() {
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
    document.getElementById('close_edit_modal').style.display = 'inline-block';
    document.getElementById('add_individual').style.display = 'inline-block';
    modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
    document.getElementById('search_for_edit').style.display = 'block';
    document.getElementById('edit_individual').style.display = 'none';
  }

  document.getElementById('close_edit_modal').onclick = function() {
    modal.style.display = "none";
    document.getElementById('search_for_edit').style.display = 'block';
    document.getElementById('edit_individual').style.display = 'none';
  }


  document.getElementById('cancel_action').onclick = function() {
    document.getElementById('submit_edit_individual').style.display = 'none';
    document.getElementById('submit_add_individual').style.display = 'none';
    document.getElementById('delete_individual').style.display = 'none';
    document.getElementById('cancel_action').style.display = 'none';
    document.getElementById('close_edit_modal').style.display = 'inline-block';
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

  let search_drops = document.getElementsByClassName('modaldropsearch');

  for (let i = 0; i < search_drops.length; i++) {
    search_drops[i].innerHTML = '';
  }

  console.log(search_drops)
  for (person in individuals) {
    if (person != id) {
      let item = document.createElement('OPTION');
      item.setAttribute('name', person);
      item.setAttribute('value', person);
      item.innerHTML = full_name(individuals[person])
      for (let i = 0; i < search_drops.length; i++) {
        let clone = item.cloneNode(true);
        search_drops[i].append(clone);
      }
    }
  }

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

  document.getElementById('current_individual').innerHTML = full_name(individuals[id]);

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

    window.total_num_marriages = 0;

    document.getElementById('Spouse_m1').disabled = true; 
    $('#Spouse_m1').prop('disabled', true).trigger("chosen:updated");
    document.getElementById('Status_m1').disabled = true; 
    $('#Status_m1').prop('disabled', true).trigger("chosen:updated");
  } else if (individuals[id].Num_marriages == 1) {
    $('#Children_m1').val(individuals[id].Children[0]);
    $('#Children_m1').trigger('chosen:updated');

    $('#Spouse_m1').val([individuals[id].Spouse[0]]);
    $('#Spouse_m1').trigger('chosen:updated');

    $('#Status_m1').val([individuals[id].Marriage_Status[0]]);
    $('#Status_m1').trigger('chosen:updated');

    document.getElementById('Spouse_m1').disabled = false; 
    $('#Spouse_m1').prop('disabled', false).trigger("chosen:updated");
    document.getElementById('Status_m1').disabled = false; 
    $('#Status_m1').prop('disabled', false).trigger("chosen:updated");
    window.total_num_marriages = 1;
  } else {
    window.total_num_marriages = 0;
    new_marriage_drop(individuals[id].Num_marriages);
    window.total_num_marriages = individuals[id].Num_marriages;

    for (let i = 1; i <= individuals[id].Num_marriages; i++) {
      $('#Spouse_m' + i).val([individuals[id].Spouse[i - 1]]);
      $('#Spouse_m' + i).trigger('chosen:updated');
      $('#Children_m' + i).val(individuals[id].Children[i - 1]);
      $('#Children_m' + i).trigger('chosen:updated');
      $('#Status_m' + i).val([individuals[id].Marriage_Status[i - 1]]);
      $('#Status_m' + i).trigger('chosen:updated');
    }
  }
}

function populate_fields_with_code(code) {
  
  let params = code.split(' ');
  let parent1 = null;
  let parent2 = null;
  let siblings = [];
  let spouse = null;
  let children = [];
  for (param in params) {
    let str = params[param];
    if (str.indexOf('po') != -1) {
      parent1 = parseInt(str.split('po')[1]);
    } else if (params[param].indexOf('pt') != -1) {
      parent2 = parseInt(str.split('pt')[1]);
    } else if (params[param].indexOf('sib') != -1) {
      siblings.push( parseInt(str.split('sib')[1]) );
    } else if (params[param].indexOf('sp') != -1) {
      spouse = parseInt(str.split('sp')[1]);
    } else if (params[param].indexOf('c') != -1) {
      children.push( parseInt(str.split('c')[1]) );
    }
  }

  console.log(parent1);
  console.log(parent2);
  console.log(siblings);
  console.log(spouse);
  console.log(children);

  $('#Parents').val([parent1, parent2]);
  $('#Parents').trigger('chosen:updated');

  $('#Siblings').val(siblings);
  $('#Siblings').trigger('chosen:updated');

  // document.getElementById('Num_marriages').value = individuals[id].Num_marriages;

  if (spouse == null && children.length == 0) {
    console.log('eeee');
    document.getElementById('Num_marriages').value = 0;
    
    $('#Children_m1').val([]);
    $('#Children_m1').trigger('chosen:updated');

    
    $('#Spouse_m1').val([]);
    $('#Spouse_m1').trigger('chosen:updated');

    $('#Status_m1').val([]);
    $('#Status_m1').trigger('chosen:updated');

    window.total_num_marriages = 0;

    document.getElementById('Spouse_m1').disabled = true; 
    $('#Spouse_m1').prop('disabled', true).trigger("chosen:updated");
    document.getElementById('Status_m1').disabled = true; 
    $('#Status_m1').prop('disabled', true).trigger("chosen:updated");
  } else {
    console.log('ffff');
    document.getElementById('Num_marriages').value = 1;
    $('#Children_m1').val(children);
    $('#Children_m1').trigger('chosen:updated');

    $('#Spouse_m1').val([spouse]);
    $('#Spouse_m1').trigger('chosen:updated');

    $('#Status_m1').val([]);
    $('#Status_m1').trigger('chosen:updated');

    document.getElementById('Spouse_m1').disabled = false; 
    $('#Spouse_m1').prop('disabled', false).trigger("chosen:updated");
    document.getElementById('Status_m1').disabled = false; 
    $('#Status_m1').prop('disabled', false).trigger("chosen:updated");
    window.total_num_marriages = 1;
  }
}

function init_marriage_drop(num) {

  let search_drops = document.getElementById('m' + num).getElementsByClassName('modaldropsearch');
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
      item.innerHTML = full_name(individuals[person])
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
  } else if (window.total_num_marriages == 0 && new_num > 1) {
    window.total_num_marriages+=2;
    document.getElementById('Spouse_m1').disabled = false; 
    $('#Spouse_m1').prop('disabled', false).trigger("chosen:updated");
    document.getElementById('Status_m1').disabled = false; 
    $('#Status_m1').prop('disabled', false).trigger("chosen:updated");
    let marriage_container = document.getElementById('extra_m');
    for (let i = window.total_num_marriages; i <= new_num; i++) {
      console.log(i)
      let marriage = `  <div id=m` + i + `>
                          <hr style="border-top: 1px dashed #bbb;">
                          <label for="Spouse_m` + i + `">Spouse for Marriage ` + i + `</label><br>
                          <select name="Spouse_m` + i + `" id="Spouse_m` + i + `" class="modaldropsearch" multiple></select><br><br>
                          <label for="Children_m` + i + `">Children for Marriage ` + i + `</label><br>
                          <select name="Children_m` + i + `" id="Children_m` + i + `" class="modaldropsearch" multiple></select><br><br>
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

    for (let i = window.total_num_marriages; i <= new_num; i++) {
      init_marriage_drop(i);
    }
  } else {
    window.total_num_marriages+=1;
    let marriage_container = document.getElementById('extra_m');
    for (let i = window.total_num_marriages; i <= new_num; i++) {
      console.log(i)
      let marriage = `  <div id=m` + i + `>
                          <hr style="border-top: 1px dashed #bbb;">
                          <label for="Spouse_m` + i + `">Spouse for Marriage ` + i + `</label><br>
                          <select name="Spouse_m` + i + `" id="Spouse_m` + i + `" class="modaldropsearch" multiple></select><br><br>
                          <label for="Children_m` + i + `">Children for Marriage ` + i + `</label><br>
                          <select name="Children_m` + i + `" id="Children_m` + i + `" class="modaldropsearch" multiple></select><br><br>
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

    for (let i = window.total_num_marriages; i <= new_num; i++) {
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

    window.total_num_marriages = 0;

    document.getElementById('Spouse_m1').disabled = true; 
    $('#Spouse_m1').prop('disabled', true).trigger("chosen:updated");
    document.getElementById('Status_m1').disabled = true; 
    $('#Status_m1').prop('disabled', true).trigger("chosen:updated");
  } else if (new_num == 1) {
    document.getElementById('extra_m').innerHTML="";
  } else {
    for (let i = window.total_num_marriages; i > new_num; i--) {
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
  if (individual.Gender == '') individual.Gender = 'none'
  individual.Parent1 = $('#Parents').val()[0];
  if (individual.Parent2 == undefined) individual.Parent1 = null;
  individual.Parent2 = $('#Parents').val()[1];
  if (individual.Parent2 == undefined) individual.Parent2 = null;
  individual.Siblings = [];
  for (let i = 0; i < $('#Siblings').val().length; i++) {
    individual.Siblings.push($('#Siblings').val()[i]);
  }

  individual.Num_marriages = window.total_num_marriages;
  individual.Spouse = [];
  individual.Children = [];
  individual.Marriage_Status = [];

  for (let i = 1; i <= window.total_num_marriages; i++) { 
    individual.Spouse[i - 1] = $('#Spouse_m' + i).val()[0];
    individual.Children[i - 1] = $('#Children_m' + i).val();
    individual.Marriage_Status[i - 1] = $('#Status_m' + i).val()[0];
  }

  
  individual.Extra = document.getElementById('Extra').value;

  console.log(individual)

  return [individual, document.getElementById('Link_Data').checked];
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
  if (individual.Gender == '') individual.Gender = 'none'
  individual.Parent1 = $('#Parents').val()[0];
  if (individual.Parent1 == undefined) individual.Parent1 = null;
  individual.Parent2 = $('#Parents').val()[1];
  if (individual.Parent2 == undefined) individual.Parent2 = null;
  individual.Siblings = [];
  for (let i = 0; i < $('#Siblings').val().length; i++) {
    individual.Siblings.push($('#Siblings').val()[i]);
  }

  individual.Num_marriages = window.total_num_marriages;

  console.log(window.total_num_marriages)

  individual.Spouse = [];
  individual.Children = [];
  individual.Marriage_Status = [];

  for (let i = 1; i <= window.total_num_marriages; i++) { 
    individual.Spouse[i - 1] = $('#Spouse_m' + i).val()[0];
    individual.Children[i - 1] = $('#Children_m' + i).val();
    console.log($('#Status_m' + i).val()[0]);
    individual.Marriage_Status[i - 1] = $('#Status_m' + i).val()[0];
  }

  individual.Extra = document.getElementById('Extra').value;

  console.log(individual)

  return [individual, document.getElementById('Link_Data').checked];
}

async function send_edit_data(id) {
  code = await request_edit(id, collect_edit_data(id));
  if (code != 'complete') {
    window.alert(code);
    window.alert('Please reload the page');
  } else {
    request_tree(localStorage.getItem('current_tree'));
  }
}

function edit_individual(id) {
  if (localStorage.getItem('view_only') == 'false') {
    document.getElementById('submit_edit_individual').style.display = 'inline-block';
    document.getElementById('cancel_action').style.display = 'inline-block';
    document.getElementById('delete_individual').style.display = 'inline-block';
    document.getElementById('submit_add_individual').style.display = 'none';
    document.getElementById('add_individual').style.display = 'none';
    document.getElementById('close_edit_modal').style.display = 'none';

    if (id == -1) {
      document.getElementById('submit_add_individual').onclick = async function() {
        send_add_data();
      }
    }

    document.getElementById('submit_edit_individual').onclick = async function() {
      send_edit_data(id);
    }
  }
  document.getElementById('search_for_edit').style.display = 'none';
  document.getElementById('edit_individual').style.display = 'block';

  populate_dropdowns(id);
  populate_fields(id);

  document.getElementById('Num_marriages').addEventListener('change', function() {
    if (this.value < window.total_num_marriages) del_marriage_drop(this.value, false);
    if (this.value > window.total_num_marriages) new_marriage_drop(this.value);
    window.total_num_marriages = this.value;
    console.log('done')
  })

}

function add_individual() {
  if (localStorage.getItem('view_only') == 'false') {
    document.getElementById('submit_edit_individual').style.display = 'none';
    document.getElementById('cancel_action').style.display = 'inline-block';
    document.getElementById('submit_add_individual').style.display = 'inline-block';
    document.getElementById('delete_individual').style.display = 'none';
    document.getElementById('add_individual').style.display = 'none';
    document.getElementById('close_edit_modal').style.display = 'none';
  }
  document.getElementById('search_for_edit').style.display = 'none';
  document.getElementById('edit_individual').style.display = 'block';

  populate_dropdowns(0);
  // populate_fields(id);

  document.getElementById('Num_marriages').value = 0;

  document.getElementById('submit_add_individual').onclick = function() {
    send_add_data();
  }
}
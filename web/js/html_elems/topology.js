// First function called on a page load for topology.html
function load_page() {
  // Checks whether topology is being accessed through
  // view only link. If it is not beig accessed through
  // a view only link, checks for successful 
  // login to the current tree. Otherwise, kicks the 
  // user to the login page.
  if (localStorage.getItem('view_only') == 'false') {
    if (!login_status()) window.location = 'login.html';
  }

  // If a root individual is saved in the browsers storage
  // for this tree, draw the tree starting from them.
  if (localStorage.getItem('current_individual') != 'no_curr') 
    make_tree(localStorage.getItem('current_individual'));

  // Render all dynamic content for the website.
  document.getElementById('active_tree').innerHTML = 'Current family tree: ' + localStorage.getItem('current_tree');
  render_table('EDIT');
  init_edit_modal();
  init_share_modal();

  // If set to view only mode, disable any editing abilities.
  if(localStorage.getItem('view_only') == 'true') {
    localStorage.setItem('show_edit_nodes', 'false');
    document.getElementById('edit_switch').remove();
    document.getElementById('sharing_settings').remove();
    document.getElementById('edit_tree').remove();
    document.getElementById('portal_link').remove();
    document.getElementById('edit_family_tree_title').innerHTML = 'View Family Tree';
    for (let i = 0; i < document.getElementsByClassName('not_for_viewer').length; i) {
      document.getElementsByClassName('not_for_viewer')[i].remove();
    }
  }

  let tree_data = JSON.parse(localStorage.getItem('current_tree_data'));
  let individuals = tree_data.individuals[0];

  $('#selector').chosen("destroy");

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
      item.innerHTML = full_name(individuals[person])
      for (let i = 0; i < search_drops.length; i++) {
        let clone = item.cloneNode(true);
        search_drops[i].append(clone);
      }
    }
  }
  
  $('#selector').chosen({
    no_results_text: "Oops, nothing found!",
    max_selected_options: 1,
    width: '310px',
    placeholder_text_multiple: 'Select an option'
  });
}

function toggle_edit_nodes() {
  if (localStorage.getItem('show_edit_nodes') == 'false') {
    localStorage.setItem('show_edit_nodes', 'true');
    if (localStorage.getItem('current_individual') != 'no_curr') 
      make_tree(localStorage.getItem('current_individual'));
  } else {
    localStorage.setItem('show_edit_nodes', 'false');
    if (localStorage.getItem('current_individual') != 'no_curr') 
      make_tree(localStorage.getItem('current_individual'));
  }
}

function make_tree(id) {
  localStorage.setItem('current_individual', id);
  document.getElementById('family_tree').innerHTML = '';
  if (localStorage.getItem('view_only') == 'true') {
    show_edit_nodes = false;
  }

  let tree_data = JSON.parse(localStorage.getItem('current_tree_data'));
  let tree = [];
  let individuals = tree_data.individuals[0];

  if (localStorage.getItem('show_edit_nodes') == 'true') {
    tree = make_edit_tree(id, tree, individuals);
  } else {
    tree = make_view_tree(id, tree, individuals);
  }

  console.log(tree);

  d3_tree = dTree.init(tree, 
                        {target: "#family_tree", 
                        height: 800, 
                        width: 1900, 
                        callbacks: {
                          nodeClick: function(name, extra, id) {
                            if (isNaN(parseInt(extra))) {
                              document.getElementById("edit_tree_modal").style.display = "block";
                              add_individual();
                              populate_fields_with_code(extra.substr(4));
                            } else if (extra != null && extra != -1) make_tree(extra);
                          },
                          nodeRightClick: function(name, extra, id) {
                            if (isNaN(parseInt(extra))) {
                              document.getElementById("edit_tree_modal").style.display = "block";
                              add_individual();
                              populate_fields_with_code(extra.substr(4));
                            } else if (extra != null && extra != -1) {
                              document.getElementById("edit_tree_modal").style.display = "block";
                              edit_individual(extra);
                            }
                          }
                        }
                        });

  let center = document.getElementsByClassName('tree_center');

  //d3_tree.zoomToNode(parseInt(center[0].id.substr(4)), zoom=2, duartion = 0);
  d3_tree.zoomTo(0, 200, zoom=2, duartion = 0);
}

function make_view_tree(id, tree, individuals) {

  let individual = individuals[id];

  if (individual.Parent1 != null && individual.Parent2 != null) {
    tree.push(make_node(individuals[individual.Parent1], individual.Parent1));
    tree[0].marriages = [{
      "spouse": make_node(individuals[individual.Parent2], individual.Parent2),
      "children": []
    }]
  } else if (individual.Parent1 != null) {
    tree.push(make_node(individuals[individual.Parent1], individual.Parent1));
    tree[0].marriages = [{
      "spouse": {
        "name": "No 2nd parent",
        "class": "none",
        "textClass": null
      },
      "children": []
    }]
  } else {
    tree.push({
                "name": "No 1st parent",
                "class": "none",
                "textClass": null,
                "marriages": [{
                  "spouse": {
                    "name": "No 2nd parent",
                    "class": "none",
                    "textClass": null
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
      siblings.push(make_node(individuals[individual.Siblings[i]], individual.Siblings[i]));
    }
    siblings.splice(Math.round(siblings_length/2), 0, make_node(individual, id, "tree_center"));
    my_index = Math.round(siblings_length/2);
  } else {
    siblings.push({
      "name": "No siblings",
      "class": "none",
      "textClass": null
    }, make_node(individual, id, "tree_center"));
  }

  let me = tree[0].marriages[0].children[my_index]
  me.marriages = [];

  let spouse_length = individual.Spouse.length

  if (spouse_length != 0) {
    for (let i = 0; i < spouse_length; i++) {

      if (individual.Spouse[i] != null) {
        me.marriages.push({ "spouse" : make_node(individuals[individual.Spouse[i]], individual.Spouse[i]) });
      } else {
        me.marriages.push({
          "spouse": {
            "name": "No spouse",
            "class": "none",
            "textClass": null
          }
        })
      }

      if (individual.Children[i] != null) {
        let children_length = individual.Children[i].length

        if (children_length != 0) {
          me.marriages[i].children = [];
          for (let j = 0; j < children_length; j++) {
            me.marriages[i].children.push(make_node(individuals[individual.Children[i][j]],
                                                    individual.Children[i][j]));
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

  return tree;
}

function make_edit_tree(id, tree, individuals) {
  
  let individual = individuals[id];

  console.log(individual.Siblings);

  if (individual.Parent1 != null && individual.Parent2 != null) {
    tree.push(make_node(individuals[individual.Parent1], individual.Parent1));
    tree[0].marriages = [{
      "spouse": make_node(individuals[individual.Parent2], individual.Parent2),
      "children": []
    }];
  } else if (individual.Parent1 != null) {
    tree.push(make_node(individuals[individual.Parent1], individual.Parent1));
    tree[0].marriages = [{
      "spouse": {
        "name": "Add 2nd parent",
        "class": "add",
        "textClass": null,
        "extra": "add " + make_add_code(null,
                                        null,
                                        null,
                                        individual.Parent1,
                                        [id].concat(individual.Siblings))
      },
      "children": []
    }];
  } else {
    tree.push({
                "name": "Add 1st parent",
                "class": "add",
                "textClass": null,
                "extra": "add " + make_add_code(null,
                                                null,
                                                null,
                                                null,
                                                [id].concat(individual.Siblings)),
                "marriages": [{
                  "spouse": {
                    "name": "No 2nd parent",
                    "class": "none",
                    "textClass": null,
                    "extra": -1
                  },
                  "children": []
                }]
              });
  }

  let siblings = tree[0].marriages[0].children;
  let siblings_length = individual.Siblings.length;
  let my_index = 0;

  siblings.push({
    "name": "Add sibling",
    "class": "add",
    "textClass": null,
    "extra": "add " + make_add_code(individual.Parent1,
                                    individual.Parent2,
                                    [id].concat(individual.Siblings),
                                    null,
                                    null)
  });

  if (siblings_length != 0) {
    for (let i = 0; i < siblings_length; i++) {
      siblings.push(make_node(individuals[individual.Siblings[i]], individual.Siblings[i]));
    }
    siblings.splice(Math.round( (siblings_length + 1)/2), 0, make_node(individual, id, "tree_center"));
    my_index = Math.round( (siblings_length + 1)/2);
  } else {
    siblings.push(make_node(individual, id, "tree_center"))
  }

  let me = tree[0].marriages[0].children[my_index]
  me.marriages = [];

  let spouse_length = individual.Spouse.length

  if (spouse_length != 0) {
    for (let i = 0; i < spouse_length; i++) {

      if (individual.Spouse[i] != null) {
        me.marriages.push({ "spouse" : make_node(individuals[individual.Spouse[i]], individual.Spouse[i]) });
      } else {
        me.marriages.push({
          "spouse": {
            "name": "Add spouse",
            "class": "add",
            "textClass": null,
            "extra": "add " + make_add_code(null,
                                            null,
                                            null,
                                            id,
                                            individual.children)
          }
        })
      }

      if (individual.Children[i] != null) {
        let children_length = individual.Children[i].length
        me.marriages[i].children = [];
        for (let j = 0; j < children_length; j++) {
          me.marriages[i].children.push(make_node(individuals[individual.Children[i][j]],
                                                  individual.Children[i][j]));
        }
        me.marriages[i].children.push({
          "name": "Add child",
          "class": "add",
          "textClass": null,
          "extra": "add " + make_add_code(id,
                                          individual.Spouse[i],
                                          individual.Children[i],
                                          null,
                                          null)
        })
      } else {
        me.marriages[i].children = [];
        me.marriages[i].children.push({
                                        "name": "Add child",
                                        "class": "add",
                                        "textClass": null,
                                        "extra": "add " + make_add_code(id,
                                                                        individual.Spouse[i],
                                                                        individual.Children[i],
                                                                        null,
                                                                        null)
                                      })
      }
    }
  }
  me.marriages.push({
    "spouse": {
      "name": "Add spouse",
      "class": "add",
      "textClass": null,
      "extra": "add " + make_add_code(null,
                                      null,
                                      null,
                                      id,
                                      null)
    },
    "children": [{
      "name": "Add child",
      "class": "add",
      "textClass": null,
      "extra": "add " + make_add_code(id,
                                      null,
                                      null,
                                      null,
                                      null)
    }]
  })

  return tree;
}

function make_node(individual, id, class_data="") {
  return  {
            "name": full_name(individual),
            "class": 'tree_node ' + individual.Gender + ' ' + is_dead(individual.DOD) + ' ' + class_data,
            "textClass": null,
            "extra": id
          }
}

function make_add_code(p1, p2, siblings, spouse, children) {
  let return_string = "";
  if (p1 != null) return_string += "po" + p1 + " ";
  if (p2 != null) return_string += "pt" + p2 + " ";
  for (sibling in siblings) {
    return_string += "sib" + siblings[sibling] + " ";
  }
  if (spouse != null) return_string += "sp" + spouse + " ";
  for (child in children) {
    return_string += "c" + children[child] + " ";
  }

  return return_string;
}

function is_dead(DOD) {
  if (DOD == '') return '';
  return 'dead'
}

function full_name(individual) {
  let name = '';
  if (individual.Fname != null) {
    name += individual.Fname + ' ';
  }
  if (individual.Mname != null) {
    name += individual.Mname + ' ';
  }
  if (individual.Lname != null) {
    name += individual.Lname;
  }
  return name;
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

load_page()

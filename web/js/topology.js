function load_page() {
  if (localStorage.getItem('view_only') == 'false') {
    if (!login_status()) window.location = 'login.html';
  }

  if (localStorage.getItem('current_individual') != 'no_curr') make_tree(localStorage.getItem('current_individual'));

  document.getElementById('active_tree').innerHTML = 'Current family tree: ' + localStorage.getItem('current_tree');

  render_table('SEARCH');
  render_table('EDIT')

  let tree_data = JSON.parse(localStorage.getItem('current_tree_data'));

  init_edit_modal();
  init_share_modal();

  if(localStorage.getItem('view_only') == 'true') {
    document.getElementById('sharing_settings').remove();
    document.getElementById('edit_tree').remove();
    document.getElementById('portal_link').remove();
    document.getElementById('edit_family_tree_title').innerHTML = 'View Family Tree';

    for (let i = 0; i < document.getElementsByClassName('not_for_viewer').length; i) {
      document.getElementsByClassName('not_for_viewer')[i].remove();
    }
  }
}

function make_tree(id) {
  current_individual = id;
  localStorage.setItem('current_individual', current_individual);
  document.getElementById('family_tree').innerHTML = '';
  if (localStorage.getItem('view_only') == false) {
    if (!login_status()) window.location = 'login.html';
  }

  let tree_data = JSON.parse(localStorage.getItem('current_tree_data'));
  let tree = [];
  let individuals = tree_data.individuals[0];
  let individual = individuals[id];

  console.log(tree_data);

  if (individual.Parent1 != null && individual.Parent2 != null) {
    tree.push({
                "name": full_name(individuals, individual.Parent1),
                "class": individuals[individual.Parent1].Gender + ' ' + is_dead(individuals[individual.Parent1].DOD),
                "textClass": null,
                "extra": individual.Parent1,
                "marriages": [{
                  "spouse": {
                    "name": full_name(individuals, individual.Parent2),
                    "class": individuals[individual.Parent2].Gender + ' ' + is_dead(individuals[individual.Parent2].DOD),
                    "textClass": null,
                    "extra": individual.Parent2
                  },
                  "children": []
                }]
              })
  } else if (individual.Parent1 != null) {
    tree.push({
                "name": full_name(individuals, individual.Parent1),
                "class": individuals[individual.Parent1].Gender + ' ' + is_dead(individuals[individual.Parent1].DOD),
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
        "class": individuals[individual.Siblings[i]].Gender + ' ' + is_dead(individuals[individual.Siblings[i]].DOD),
        "textClass": null,
        "extra": individual.Siblings[i]
      });
    }

    siblings.splice(Math.round(siblings_length/2), 0, {
                                                        "name": full_name(individuals, id),
                                                        "class": individual.Gender + " tree_center " + is_dead(individual.DOD),
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
      "class": individual.Gender + " tree_center " + is_dead(individual.DOD),
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
            "class": individuals[individual.Spouse[i]].Gender + ' ' + is_dead(individuals[individual.Spouse[i]].DOD),
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
                                            "class": individuals[individual.Children[i][j]].Gender + ' ' + is_dead(individuals[individual.Children[i][j]].DOD),
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

  d3_tree.zoomToNode(parseInt(center[0].id.substr(4)), zoom=2, duartion = 0);

  //d3_tree.zoomTo(0, 200, zoom = 2, duration = 500);
}

function is_dead(DOD) {
  if (DOD == '') return '';
  return 'dead'
}

function full_name(individuals, id) {
  let name = '';
  console.log(id)
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

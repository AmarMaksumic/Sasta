function get_url_vars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
  });
  return vars;
}

function redirect_url() {
  let params = get_url_vars();
  if (params.gfdd != undefined && params.dodd != undefined) {
    request_tree_view(params.gfdd, params.dodd);
  }
}



// http://127.0.0.1:5500/web/link.html?gfdd=maksumic&dodd=1234
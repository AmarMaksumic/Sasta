// Helper function to collect URL parameters.
function get_url_vars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
  });
  return vars;
}

// Helper function to handle redirect URLS.
function redirect_url() {
  let params = get_url_vars();
  if (params.gfdd != undefined && params.dldd != undefined) {
    request_tree_view(params.gfdd, params.dldd);
  }
}
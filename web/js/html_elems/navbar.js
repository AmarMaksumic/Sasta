function navbar_hide(is_hide) {
  if (is_hide) {
    elems_to_hide = document.getElementsByClassName('nav_hide')
    for (let i = 0; i < elems_to_hide.length; i++) {
      elems_to_hide[i].style.display = 'none';
    }
    elems_to_show = document.getElementsByClassName('nav_show')
    for (let i = 0; i < elems_to_show.length; i++) {
      elems_to_show[i].style.display = 'inherit';
    }
  } else {
    elems_to_hide = document.getElementsByClassName('nav_show')
    for (let i = 0; i < elems_to_hide.length; i++) {
      elems_to_hide[i].style.display = 'none';
    }
    elems_to_show = document.getElementsByClassName('nav_hide')
    for (let i = 0; i < elems_to_show.length; i++) {
      elems_to_show[i].style.display = 'inherit';
    }
  }
}

function nav_menu() {
  var x = document.getElementById('navbar')
  if (x.className === 'topnav') {
    x.classList.add('responsive')
    console.log('r')
  } else {
    x.classList.remove('responsive')
    console.log('x')
  }
}

async function switchTab (switchTo) {
  console.log(switchTo)
  for (let i = 1; i < 5; i++) {
    document.getElementById('tab_' + i).classList.remove('active')
  }
  
  document.getElementById('page_stripe').style.right = null;
  document.getElementById('page_stripe').style.left = '0px';
  
  $('#page_cont').animate({'zoom': 0.5, width: '50%'}, 400, 'swing', function(){

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    $('#page_stripe').animate({width: '100%'}, 600, 'swing', function(){

      switch(switchTo) {
        case 1:
          if (window.matchMedia("(max-width: 1000px)").matches) $('#cont').load('html/m_home.html')
          else $('#cont').load('html/home.html')
          break;
        case 2:
          $('#cont').load('html/portal.html')
          break;
        case 3:
          $('#cont').load('html/wiki.html')
          break;
        case 4:
          $('#cont').load('html/login.html')
          break;
        case 63:
          $('#cont').load('html/topology.html')
          break;
        default:
          if (window.matchMedia("(max-width: 1000px)").matches) $('#cont').load('html/m_home.html')
          else $('#cont').load('html/home.html')
      }

      document.getElementById('page_stripe').style.right = '0px';
      document.getElementById('page_stripe').style.left = null;
    
      $('#page_stripe').animate({width: '0%'}, 600, 'swing', function(){

        $('#page_cont').animate({'zoom': 1, width: '100%'}, 400, 'swing');

      });
    });
  });

  if (switchTo != 63) document.getElementById('tab_' + switchTo).classList.add('active');
}

// When the user scrolls the page, execute myFunction
window.onscroll = function() {myFunction()};

function myFunction() {
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var scrolled = (winScroll / height) * 100;
  document.getElementById('myBar').style.width = scrolled + '%';
}
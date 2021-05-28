
// Get the modal
var modal = document.getElementById('myModal')

var x = document.getElementById('close')

var cancel = document.getElementById('cancel')

x.onclick = function() {
  modal.style.display = 'none'
}

cancel.onclick = function() {
  modal.style.display = 'none'}


// Get the button that opens the modal
var btn = document.getElementById('myBtn')
// Get the <span> element that closes the modal
var span = document.getElementsByClassName('close')[0]

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = 'block'
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = 'none'
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none'
  }

}

function openReview() {
  document.getElementById('myReview').style.display = 'block'
}

function closeReview() {
  document.getElementById('myReview').style.display = 'none'
}


function togglediv() {
  var element = document.getElementById('previous')
  var but = document.getElementById('previous_but')
  if (element.style.display != 'none') {
      element.style.display = 'none'
      but.innerHTML = 'Open'
  } else {
    if (element.style.display == 'none') {
      element.style.display = 'block'
      but.innerHTML = 'Close'
    }
  }
}

function toggle_future_appointments() {
  var element = document.getElementById('future')
  var but = document.getElementById('future_but')
  if (element.style.display != 'none') {
      element.style.display = 'none'
      but.innerHTML = 'Open'
  } else {
    if (element.style.display == 'none') {
      element.style.display = 'block'
      but.innerHTML = 'Close'
    }
  }
}
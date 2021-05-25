
// // Get the modal
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
  document.getElementById("myReview").style.display = "block";
}

function closeReview() {
  document.getElementById("myReview").style.display = "none";
}


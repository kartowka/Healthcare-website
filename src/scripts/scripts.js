function openNav() {
    document.getElementById('mySidebar').style.width = '250px'
    document.getElementById('main').style.marginLeft = '250px'
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById('mySidebar').style.width = '0'
    document.getElementById('main').style.marginLeft = '0'
}

$(document).ready(function () {
    // set initially button state hidden
    $('#btn').hide()
    // use keyup event on email field
    $('#email').keyup(function () {
        if (validateEmail()) {
            // if the email is validated
            // set input email border green
            $('#email').css('border', '2px solid green')
            // and set label 
        } else {
            // if the email is not validated
            // set border red
            $('#email').css('border', '2px solid red')
        }
        buttonState()
    })
    // use keyup event on password
    $('#pwd').keyup(function () {
        // check
        if (validatePassword()) {
            // set input password border green
            $('#pwd').css('border', '2px solid green')
            //set passMsg 
        } else {
            // set input password border red
            $('#pwd').css('border', '2px solid red')
            //set passMsg 
        }
        buttonState()
    })
})

function buttonState() {
    if (validateEmail() && validatePassword()) {
        // if the both email and password are validate
        // then button should show visible
        $('#btn').show()
    } else {
        // if both email and pasword are not validated
        // button state should hidden
        $('#btn').hide()
    }
}
function validateEmail() {
    // get value of input email
    var email = $('#email').val()
    // use reular expression
    var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    if (reg.test(email)) {
        return true
    } else {
        return false
    }

}
function validatePassword() {
    //get input password value
    var pwd = $('#pwd').val()
    // check it s length
    if (pwd.length > 7) {
        return true
    } else {
        return false
    }

}
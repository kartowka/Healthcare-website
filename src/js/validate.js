$(document).ready(function () {
    // set initially button state hidden
    $('#btn').attr('disabled', true)
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
    $('#pwd_main').keyup(function () {
        // check
    
        buttonState()
    })

    $('#pwd_rep').keyup(function () {
        // check
        if (validatePasswordPairLength()) {
            // set input password border green
            $('#pwd_main').css('border', '2px solid green')
            $('#pwd_rep').css('border', '2px solid green')
            //set passMsg 
        } else {
            // set input password border red
            $('#pwd_main').css('border', '2px solid red')
            $('#pwd_rep').css('border', '2px solid red')
            //set passMsg 
        }
        buttonState()
    })
})

function buttonState() {
    if (validateEmail() && checkPassStrength() && validatePasswordPairLength()) {
        // if the both email and password are validate
        // then button should show visible
        $('#btn').attr('disabled', false)
    } else {
        // if both email and pasword are not validated
        // button state should hidden
        $('#btn').attr('disabled', true)
    }
}
function validateEmail() {
    // get value of input email
    var email = $('#email').val()
    // use reular expression
    var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    if (reg.test(email)) {
        return true
    } else {
        return false
    }

}
function checkPassStrength() {
    var number = /([0-9])/
    var alphabets = /([a-zA-Z])/
    var special_characters = /([~,!,@,#,$,%,^,&,*,-,_,+,=,?,>,<])/
    var pwd = $('#pwd_main').val()
    if (pwd.length < 8) {
        $('#pwd_main-strength-status').removeClass()
        $('#pwd_main-strength-status').addClass('weak-pass')
        $('#pwd_main-strength-status').html('<b>Weak</b> (At least 8 characters in length)')
        return false
    } else {
        if (pwd.match(number) && pwd.match(alphabets) && pwd.match(special_characters) && pwd.match(/[A-Z]/)) {
            $('#pwd_main-strength-status').removeClass()
            $('#pwd_main-strength-status').addClass('strong-pass')
            $('#pwd_main-strength-status').html('<b>Very Strong</b>')
            return true
        } else {
            $('#pwd_main-strength-status').removeClass()
            $('#pwd_main-strength-status').addClass('medium-pass')
            $('#pwd_main-strength-status').html('<b>Medium</b> (Should include Alphabets, Numbers, Special characters, and 1 Capital letter)')
            return false
        }
    }
}

function validatePasswordPairLength() {
    //get input password value
    var pwd_main = $('#pwd_main').val()
    var pwd_rep = $('#pwd_rep').val()

    if (pwd_main != pwd_rep) {
        return false
    } else {
        return true
    }
}
function showDiv(divId, element) {
    document.getElementById(divId).style.display = element.value == 'doctor' ? 'block' : 'none'
}
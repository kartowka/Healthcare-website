//var bottom_ma
$(document).ready(function () {
    // set initially button state hidden
    $('#btn').attr('disabled', true)
    // use keyup event on email field
    $('#email').keyup(function () {
        if (validateEmail()) {
            // if the email is validated
            // set input email border green
            $('#email').css('border-top', '2px solid green')
            $('#email').css('border-bottom', '2px solid green')
            $('#email').css('border-left', '2px solid green')
            $('#email').css('border-right', '2px solid green')
            // and set label 
        } else {
            // if the email is not validated
            // set border red
            $('#email').css('border-top', '2px solid red')
            $('#email').css('border-bottom', '2px solid red')
            $('#email').css('border-left', '2px solid red')
            $('#email').css('border-right', '2px solid red')
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
            $('#pwd_main').css('border-top', '2px solid green')
            $('#pwd_main').css('border-bottom', '2px solid green')
            $('#pwd_main').css('border-left', '2px solid green')
            $('#pwd_main').css('border-right', '2px solid green')
            $('#pwd_rep').css('border-top', '2px solid green')
            $('#pwd_rep').css('border-bottom', '2px solid green')
            $('#pwd_rep').css('border-left', '2px solid green')
            $('#pwd_rep').css('border-right', '2px solid green')
            //set passMsg 
        } else {
            // set input password border red
            $('#pwd_main').css('border-top', '2px solid red')
            $('#pwd_main').css('border-bottom', '2px solid red')
            $('#pwd_main').css('border-left', '2px solid red')
            $('#pwd_main').css('border-right', '2px solid red')
            $('#pwd_rep').css('border-top', '2px solid red')
            $('#pwd_rep').css('border-bottom', '2px solid red')
            $('#pwd_rep').css('border-left', '2px solid red')
            $('#pwd_rep').css('border-right', '2px solid red')
            //set passMsg 
        }
        buttonState()
    })
    $('#ml_ID').keyup(function () {
        buttonState()
    })
    $('#clinic').click(function() {
        buttonState()
    })
    $('#role').click(function () {
        buttonState()
    })
})

//alert message when  egister account clicked
$(function () {
    $('#btn').click(function () {
        alert('Email Confirmation Has Been Sent')
    }
    )
})

function buttonState() {
    if (validateEmail() && checkPassStrength() && validatePasswordPairLength() && validateDoctorLicense() && validateRoleAndClinic()) {
        // if the both email and password are validate

        $('#btn').attr('disabled', false)
    }
    else {
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
    //compare password & reapeat_password
    if ($('#pwd_main').val() != $('#pwd_rep').val()) {
        return false
    } else {
        return true
    }
}

function validateDoctorLicense() {
    if ($('#role').val() == 'patient') return true
    else if ($('#ml_ID').val().length >= 10) {
        return true
    } else return false
}

function validateRoleAndClinic() {
    return $('#clinic').val() != null && $('#clinic').val() != null
}

function showDiv(divId, element) {
    document.getElementById(divId).style.display = element.value == 'doctor' ? 'block' : 'none'
}
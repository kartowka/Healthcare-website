$(document).ready(function(){
    let minFields = 1
    let maxFields = 3 //Input fields increment limitation
    let addButton = document.getElementById('add_specialization') //Add button selector
    let wrapper = document.getElementsByClassName('specializations') //Input field wrapper
    let fieldHTML = '<div class="form-row"> <div class="col-lg-6"> <div class="input-group"> <input class="form-control" type="text" id="specialization" name="specialization[]"><div class="input-group-append"><a href="javascript:void(0);" id="delete_specialization" class="btn btn-danger">Delete</a></div></div></div></div>' //New input field html 
    let x = $('input[id=\'specialization\']').length
    
    //Once add button is clicked
    $(addButton).click(function()
    {
        //Check maximum number of input fields
        if(x < maxFields)
        { 
             x++ //Increment field counter
            $(wrapper).append(fieldHTML)//Add field html
          
        }
    })
    //Once remove button is clicked
    $(wrapper).on('click','#delete_specialization', function(e){
        e.preventDefault()

        if((x - 1) >= minFields) {
            $(this).parent('div').parent('div').parent('div').remove() //Remove field html
            x-- //Decrement field counter
        }
    })
})
$(document).ready(function(){
    let minFields = 1
    let addButton = document.getElementById('add_spoken_languages') //Add button selector
    let wrapper = document.getElementsByClassName('Languages') //Input field wrapper
    let fieldHTML = '<div class="form-row"><div class="col"><div class="input-group"><input class="form-control" type="text"id="languages" name="spoken_languages" pattern="{1}[A-Za-z]"><div class="input-group-append"><a href="javascript:void(0);" id="delete_spoken_languages" class="btn btn-danger">Delete</a></div> </div></div></div>' //New input field html 
    let y = $('input[id=\'Languages\']').length
    
    //Once add button is clicked
    $(addButton).click(function()
    {
        //Check maximum number of input fields
        if(y >= minFields)
        { 
             y++ //Increment field counter
            $(wrapper).append(fieldHTML)//Add field html
          
        }
    })
    //Once remove button is clicked
    $(wrapper).on('click','#delete_spoken_languages', function(e){
        e.preventDefault()

        if((y - 1) >= minFields) {
            $(this).parent('div').parent('div').parent('div').remove() //Remove field html
            y-- //Decrement field counter
        }
    })
})
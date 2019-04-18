//Global variables

const $name = $('#name').val();
const email = document.getElementById("mail");
const card = document.getElementById("cc-num");
const zip = document.getElementById("zip");
const cvv = document.getElementById("cvv");

let $totalcost = 0;
const $costcontainer = $('<div class="total"></div>')
const $paypal = $('.credit-card + div');
const $bitcoin = $('.credit-card + div + div');
const $creditcard = $('.credit-card');

const $activities = $('.activities label input');
const $colorDefault = $('#color').html();

//Appending email validation error message after required inputs, hidden by default

$('<span style="display:none;" class="error">Please enter a valid email</span>').insertAfter(email);
$('<span style="display:none;" class="error">Please enter a valid card number</span>').insertAfter(card);
$('<span style="display:none;" class="error">Please enter a valid zip</span>').insertAfter(zip);
$('<span style="display:none;" class="error">Please enter a valid CVV</span>').insertAfter(cvv);

//Setting name as default focus

$('#name').focus();

//Credit card as default payment option

$('#payment').val('credit card');

//Hiding Bitoin and Paypal notices by defauly

$bitcoin.hide();
$paypal.hide();


//Field Validation regexp (email, zip, CC, CVV)

function validateEmail(email) {
    return /^[^@]+@[^@.]+\.[a-z]+$/i.test(email);
}

function validateCC(cardNumber) {
    return /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/.test(cardNumber);
}

function validateZip(zip) {
    return /^\d{5}$/.test(zip);
}

function validateCVV(cvv) {
    return /^\d{3}$/.test(cvv);
}


//show tooltip if field is blank or doesn't meed regexp condition, otherwise hide
function showOrHideTip(show, element) {
    if (show) {
        element.style.display = "inherit";
    } else {
        element.style.display = "none";
    }
}

// specify conditions under which tooltop should show and what's being tested
function createListener(validator) {
    return e => {
        const text = e.target.value;
        const valid = validator(text);
        const showTip = text !== "" && !valid;
        const tooltip = e.target.nextElementSibling;
        showOrHideTip(showTip, tooltip);
    };
}

email.addEventListener("input", createListener(validateEmail));
card.addEventListener("input", createListener(validateCC));
zip.addEventListener("input", createListener(validateZip));
cvv.addEventListener("input", createListener(validateCVV));


// Select default color optons

$('#color option').hide();
$('#color').append('<option value="no">please select a design</option>')
$('#color').val('no');

// when design select is changed, alter the color option dropdowns accordingly

$('#design').on('change', function() {
    if ($('#design').val() == 'js puns') {
        $('#color option').show();
        $('#color option:contains("♥ JS")').hide();
        $('#color').val('no')
    } else if ($('#design').val() == 'heart js') {
        $('#color option').show();
        $('#color option:contains("JS Puns")').hide();
        $('#color').val('no')
    } else if ($('#design').val() === 'Select Theme') {
        $('#color option:contains("♥ JS"), #color option:contains("JS Puns")').hide();
        $('#color').val('no')
    } else {
        $('#color').html($colorDefault);
    }
})

// If other is selected for job, add an input to enter it

$('#titleLabel, #otherInput').hide();

$('#title').on('change', function() {
    if ($(this).val() == 'other') {
        $('#titleLabel, #otherInput').show();
    } 
     else {
         $('#titleLabel, #otherInput').hide();
     }
});

// show hide bitcoin and paypal messages as appropriate, and remove/add required class to cc fields when selected

$('#payment').on('change', function() {
    var $selectPayment = $('#payment option:eq(0)');
    $selectPayment.hide();

    if ($(this).val() == 'paypal') {
        $bitcoin.hide();
        $creditcard.hide();
        $paypal.show();
    } else if ($(this).val() == 'bitcoin') {
        $paypal.hide();
        $creditcard.hide();
        $bitcoin.show();
    } else {
        $bitcoin.hide();
        $paypal.hide();
        $creditcard.show();
    }
    if ($('#payment option[value="credit card"]').is(':selected')) {
        $('input#cc-num, input#zip, input#cvv').addClass('required')
    } else {
        $('input#cc-num, input#zip, input#cvv').removeClass('required');
    }
})
        


//Add, subtract activity total, hide conflicting activity time inputs

$('.activities').append($costcontainer);
$activities.on('change', function() {
    $thisDate = $(this).parent().text().split('—').pop().split(',')[0]; //parse date as the text betwen - and ,
    $cost = $(this).parent().text().split('$').pop(); //parse cost as anything following the dollar sign
    $cost = parseInt($cost); // convert cost to integer
    if ($(this).prop("checked") == true) { //if checkbox checked
        $totalcost += $cost; // add to cost
        $(".activities label:contains('" + $thisDate + "')").find('input:not(:checked)').attr('disabled', true); //hide checkbox containing the sanme date
    } else {
        $totalcost -= $cost; //subtract from cost when item unchecked.
        $('.activities input').attr('disabled', false); // show checkbox as clickable if it doesn't interfere with what' currently selected
    }
    $('.total').html('<span>Total: $</span>' + $totalcost); // append cost
});

$('input#name, input[type="email"], input#cc-num, input#zip, input#cvv').addClass('required'); // add required class to all text and email inputs

$('form').on('submit', function(e) { //run below code when user attemps to submit form
    var inputCheck = $(':checkbox:checked'); //find anything checked
    //var isFormValid = true;
    $('.required').css({ border: '4px solid red' }); //by default lets assume nothing has been filled out so highlight all inputs

    $('.required').each(function() { // loop through all required items
        var inputCheck = $(':checkbox:checked'); // re-check for any checked input

        // if required is blank, or at least one checkbox isn't cheched, or if a regexp warning is displayed
        if ($(this).val() == '' || $(inputCheck).length <= 0 || $(this).next('.error').css('display') == 'block') {
            e.preventDefault(); // prevent form from submitting
        }
        // if input is anything but name (because there's no regexp check on this), check for content and regexp errors and if none remove border
        if ($(this).val() != '' && $(this).next('.error').css('display') == 'none') {
            $(this).css({ border: '0' });
        }
        // if input is name  check for content (but not regexp errors) and if none remove border
        if ($(this).attr('id') == 'name' && $(this).val() != '') {
            $(this).css({ border: '0' });
        }
    })
    // if there's a checkbox selected, add a border, if not remove it.  we don't need this inside the loop because we're looking for
    // only one checkbox checked, not all of them

    if ($(inputCheck).length <= 0) {
        $('.activities').css({ border: '4px solid red' });
    } else {
        $('.activities').css({ border: 'none' });
    }
});
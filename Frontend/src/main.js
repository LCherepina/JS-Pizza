/**
 * Created by chaika on 25.01.16.
 */
var Google_Map;

var LIQPAY_PUBLIC_KEY = 'i94929648287';
var LIQPAY_PRIVATE_KEY = '6PgPZyg1wrrlncW09ujUHIQcnTdlaMaqG1YthG4K';
var order = {
    version: 3,
    public_key: LIQPAY_PUBLIC_KEY,
    action: "pay",
    amount: 568.00,
    currency: "UAH",
    description: "Опис транзакції",
    order_id: Math.random(),
//!!!Важливо щоб було 1, бо інакше візьме гроші!!!
    sandbox: 1
};
var data = base64(JSON.stringify(order));
var crypto = require('crypto');
function sha1(string) {
    var sha1 = crypto.createHash('sha1');
    sha1.update(string);
    return sha1.digest('base64');
}
var signature = sha1(LIQPAY_PRIVATE_KEY + data + LIQPAY_PRIVATE_KEY);

function checkNameInput() {
    var stringValue = $('#inputName').val();
    if(/^[a-zA-ZА-Яа-яієїІЄЇ]+$/.test(stringValue)) {
        $('.name-group').removeClass("has-error");
        $('.name-group').addClass("has-success");
        $(".name-help-block").attr('hidden', true);
    }else {
        $('.name-group').addClass("has-error");
        $(".name-help-block").attr('hidden', false);
    }

}
function checkPhoneInput(){
    var value = $('#inputPhone').val();
    if(/^(\+?(380[0-9]{9})|(0[0-9]{9}))+$/.test(value))
        phoneSuccess();
    else
        phoneError();
}
function checkAddressInput(){
    var value  = $('#inputAddress').val();
    geocodeAddress(value);

}

function phoneError(){
    $('.phone-group').addClass("has-error");
    $(".phone-help-block").attr('hidden', false);
}

function phoneSuccess(){
    $('.phone-group').removeClass("has-error");
    $('.phone-group').addClass("has-success");
    $(".phone-help-block").attr('hidden', true);
}


function base64(str) {
    return new Buffer(str).toString('base64');
}
function createOrder(callback){
    API.createOrder({
        name: "Client name",
        phone: "5986405654", //address
        order: Cart
    }, function(err, result){
        if(err){
            return callback(err);
        }
        callback(null, result);
    });

}


$(function(){
    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    Google_Map = require('./pizza/Google_Map');



    PizzaCart.initialiseCart();
    PizzaMenu.initialiseMenu();
    if(window.location == "http://localhost:5050/order.html") {
        var initialize = Google_Map.initialize;

        google.maps.event.addDomListener(window, 'load', initialize);
    }

    $(".clear-cart").click(function(){
        PizzaCart.clearCart();
    });


    $(".button-order").click(function(){
        location.href = '/order.html';
    });
    // $(".button-order").click(function(){
    //     PizzaCart.createOrder(function(err, data){
    //         if(err){
    //             alert("Can't create order");
    //         }
    //         else{
    //             location.href = '/order.html';
    //
    //         }
    //
    //     });
    // });
    $(".button-edit").click(function(){
        location.href = '/';
    });



   // $(".phone-help-block").attr('hidden', true);
   // $(".name-help-block").attr('hidden', true);
   // $(".address-help-block").attr('hidden', true);

    $('#inputName').on('input', function(){
        checkNameInput();
        //sendData();
    });

    $("#next-step-button").validate({
        rules: {
            name: {
                required: true,
                minlength: 2,
                onlyletters: true
            },
    $('#inputPhone').on('input', function(){
        checkPhoneInput();
        //sendData();
    });
    $('#inputAddress').on('input', function(){
       // checkAddressInput();
        var value  = $('#inputAddress').val();
        var geocodeAddress = Google_Map.geocodeAddress;
        //alert(value);
        geocodeAddress(value, function(err, adress){
            if(!err){
                console.log(adress);
            }else{
                console.log("Немає адреси");
            }

        });

    });

    $(".next-step-button").click(function(){
        createOrder();
        LiqPayCheckout.init({
            data: "Дані...",
            signature: "Підпис...",
            embedTo: "#liqpay",
            mode: "popup" // embed || popup
        }).on("liqpay.callback", function(data){
            console.log(data.status);
            console.log(data);
        }).on("liqpay.ready", function(data){
// ready
        }).on("liqpay.close", function(data){
// close
        });
    });

});
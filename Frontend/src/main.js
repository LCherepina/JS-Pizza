/**
 * Created by chaika on 25.01.16.
 */

$(function(){
    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    var Pizza_List = require('./Pizza_List');



    PizzaCart.initialiseCart();
    PizzaMenu.initialiseMenu();

    $(".clear-cart").click(function(){
        PizzaCart.clearCart();
    });

    $(".button-order").click(function(){
        PizzaCart.createOrder(function(err, data){
            if(err){
                alert("Can't create order");
            }
            else{
                alert("Order success" + JSON.stringify(data));
            }

        });
    })

    $('#form').validator().on('submit', function (e) {
        if (e.isDefaultPrevented()) {
            // handle the invalid form...
        } else {
            // everything looks good!
        }
    })

    jQuery.validator.addMethod("inputName",
        function(value, element) {
            return /^[a-zA-ZА-Яа-яієїІЄЇ]+$/.test(value);
        }, "");

    jQuery.validator.addMethod("inputPhone",
        function(value, element) {
            return /^(\+?(380[0-9]{9})|(0[0-9]{9}))+$/.test(value);
        }, "");

    $("#submit").click(function() {
        $("#next-step-button").valid();
    });

    $("#next-step-button").validate({
        rules: {
            name: {
                required: true,
                minlength: 2,
                onlyletters: true
            },
            phone: {
                required: true,
                phone: true
            },
            address: {
                required: true
            }
        },
        messages: {
            name: {
                required: "Будь ласка введіть тільки ваше ім'я, без цифр",
                minlength: "Будь ласка введіть тільки ваше ім'я, без цифр",
                onlyletters: "Будь ласка введіть тільки ваше ім'я, без цифр"
            },
            phone: {
                required: "Введіть номер телефону у форматі +380 або почніть з 0",
                phone: "Введіть номер телефону у форматі +380 або почніть з 0"
            },
            address: {
                required:"Введіть адресу доставки піци"
            }
        }
    });

    function initialize() {
        // var uluru = {lat: 50.464379, lng: 30.51913};
        // var map = new google.maps.Map(document.getElementById('map'), {
        //     zoom: 13,
        //     center: uluru
        // });
        // var marker = new google.maps.Marker({
        //     position: uluru,
        //     map: map
        // });
        var mapProp = {
            zoom: 13,
            center: {lat: 50.464379, lng: 30.51913}
        }
        var html_element = document.getElementById("map");
        var map = new google.maps.Map(html_element, mapProp);

        var point = new google.maps.LatLng(50.464379, 30.51913);
        var marker = new google.maps.Marker({
            position: point,
            map: map,
            icon: "assets/images/map-icon.png"
        });
    }
    google.maps.event.addListener(map, 'click', function(me){
        var coordinates = me.LatLng;
        geocodeLatLng(coordinates, function(err, adress){
            if(!err){
                console.log(adress);
            }else{
                console.log("Немає адреси");
            }
        })
    });

    function geocodeLatLng(latlng, callback){
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'location':latlng}, function(results,status){
            if(status===google.maps.GeocoderStatus.OK && result[1]){
                var adress = results[1].formatted_address;
                callback(null,adress);
            }else{
                callback(new Error("Can't find adress"));
            }
        });
    }
    function geocodeAddress(adress, callback){
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address':address}, function(results,status){
            if(status===google.maps.GeocoderStatus.OK && result[0]){
                var coordinates = results[0].geometry.location;
                callback(null,coordinates);
            }else{
                callback(new Error("Can't find adress"));
            }
        });
    }
    function calculateRoute(A_latlng, B_latlng, callback){
        var directionService = new google.maps.DirectionService();
        directionService.route({
            origin: A_latlng,
            destination: B_latlng,
            travelMode: google.maps.TravelMode["DRIVING"]
        }, function(response, status){
            if(status = google.maps.DirectionsStatus.OK){
                var leg = response.routes[0].legs[0];
                callback(null,{
                    duration: leg.duration
                });
            }else{
                callback(new Error("Can't find direction"));
            }
        });
    }






});
var Templates = require('../Templates');

var Storage = require('./Storage');

var API = require('../API');


var point;
var map;
var directionDisplay ;
var marker;
var marker_destination;

function initialize() {
    var mapProp = {
        center: new google.maps.LatLng(50.464379, 30.51913),
        zoom: 13

    };
    var html_element = document.getElementById("map");
    map = new google.maps.Map(html_element, mapProp);

    var point = new google.maps.LatLng(50.464379, 30.51913);
    marker = new google.maps.Marker({
        position: point,
        map: map,
        icon: "assets/images/map-icon.png"
    });

    marker_destination = new google.maps.Marker({
        position: point,
        map: map,
        icon: "assets/images/home-icon.png"
    });
    marker_destination.setVisible(false);

    google.maps.event.addListener(map, 'click', function(me){
        var coordinates = me.latLng;

        geocodeLatLng(coordinates, function(err, adress){
            if(!err){
                console.log(adress);


            }else{
                console.log("Немає адреси");

            }
        })

    });
    directionDisplay = new google.maps.DirectionsRenderer({map: map, suppressMarkers: true});
    //
}


function geocodeLatLng(latlng, callback){
    point = new google.maps.LatLng(50.464379, 30.51913);
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location':latlng}, function(results,status){
        //alert(results[1].formatted_address)
        if(status===google.maps.GeocoderStatus.OK && results[1]){
            var adress = results[1].formatted_address;
            $(".order-address-info").text( adress);
            $("#inputAddress").val(adress);
            $(".address-group").addClass("has-success");

            callback(null,adress);
        }else{

            callback(new Error("Can't find adress"));
        }
    });
    calculateRoute(point, latlng, callback);

}
function geocodeAddress(address, callback){
    point = new google.maps.LatLng(50.464379, 30.51913);
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address':address}, function(results,status){
        if(status===google.maps.GeocoderStatus.OK && results[0]){
            var coordinates = results[0].geometry.location;
            //callback(null,coordinates);
            $(".order-address-info").text( address);
            $("#inputAddress").val(address);
            $(".address-group").addClass("has-success");
            calculateRoute(point, coordinates, callback);
        }else{
            //callback(new Error("Can't find adress"));
        }
    });

}

function calculateRoute(A_latlng, B_latlng, callback) {

    var directionService = new google.maps.DirectionsService();
    directionService.route({
        origin: A_latlng,
        destination: B_latlng,
        travelMode: google.maps.TravelMode["DRIVING"]
    }, function(response, status) {
        if ( status === google.maps.DirectionsStatus.OK ) {
            directionDisplay.setDirections(response);
            var leg = response.routes[ 0 ].legs[ 0 ];
            callback(null, {
                duration: leg.duration

            });

            $(".order-time-info").text(leg.duration.text);


        } else {

            callback(new Error("Can not find direction"));
        }

    });
    marker_destination.position=B_latlng;
    marker_destination.setVisible(true);



}

exports.initialize = initialize;
exports.geocodeAddress = geocodeAddress;
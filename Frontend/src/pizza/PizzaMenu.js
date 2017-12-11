/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');

var API = require('../API');

//var Pizza_List = require('../Pizza_List');
var Pizza_List = [];

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-button-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-button-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}
var pizzaFilter={
  all: "all-pizza",
  meat: "meat-pizza",
  pineApple: "pineapples-pizza",
  mushrooms: "mushrooms-pizza",
  ocean: "ocean-pizza",
  vega: "tomato-pizza"
};

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати

    var pizza_shown = [];
    if(filter=== pizzaFilter.all) {
        Pizza_List.forEach(function(pizza){
            if(pizza.content){
                pizza_shown.push(pizza);
            }
        });

        $(".pizza-count").text("8");
        $(".count-tile").text("Усі піци");
    }



    if(filter=== pizzaFilter.meat){
        Pizza_List.forEach(function(pizza){
            if(pizza.content.meat){
                pizza_shown.push(pizza);
            }
        });
        $(".count-tile").text("М'ясні піци");

    }
    if(filter=== pizzaFilter.pineApple){
        Pizza_List.forEach(function(pizza){
            if(pizza.content.pineapple){
                pizza_shown.push(pizza);
            }
        });
        $(".count-tile").text("Піци з ананасами");
    }
    if(filter=== pizzaFilter.mushrooms){
        Pizza_List.forEach(function(pizza){
            if(pizza.content.mushroom){
                pizza_shown.push(pizza);
            }
        });
        $(".count-tile").text("Піци з грибами");
    }
    if(filter=== pizzaFilter.ocean){
        Pizza_List.forEach(function(pizza){
            if(pizza.content.ocean){
                pizza_shown.push(pizza);
            }
        });
        $(".count-tile").text("Піци з морепродуктами");
    }
    if(filter=== pizzaFilter.vega){
        Pizza_List.forEach(function(pizza){
            if(!pizza.content.meat && !pizza.content.ocean){
                pizza_shown.push(pizza);
            }
        });
        $(".count-tile").text("Вегетеріанські піци");
    }
    showPizzaList(pizza_shown);
    $(".pizza-count").text(pizza_shown.length);

}
$(".nav-pills li").on("click", function(){
    $(".nav-pills").find(".active").removeClass("active");
    $(this).addClass("active");

    var filter = this.id;
    filterPizza(filter);
});


function initialiseMenu() {
    //Показуємо усі піци

    API.getPizzaList(function(err,list ){
       if(err){
           alert("Can't load page.")
       }else{
           Pizza_List = list;
           showPizzaList(Pizza_List)
       }

    });


}


exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;
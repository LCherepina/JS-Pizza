/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');

var Storage = require('./Storage')

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");



function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок
    var wasAdded = false;
    for(var i=0; i<Cart.length; i++) {
        if (Cart[i].pizza == pizza && Cart[i].size == size) {
            Cart[i].quantity += 1;

            wasAdded = true;
        }
    }
    // var total_price = 0;
    // for(var i=0; i<Cart.length; i++){
    //     total_price += Cart[i].price_label;
    // }

    if(!wasAdded) {
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1
          //  priceLabel: price
        });
    }

    //Оновити вміст кошика на сторінці
    updateCart();
}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика
   // alert();
    for(var i=0; i<Cart.length; i++){
        if(Cart[i]==cart_item) {
            Cart.splice(i, 1);
            break;
        }
    }
    //Після видалення оновити відображення
    updateCart();
}
function clearCart(){
    Cart = [] ;

    updateCart();
}


function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    //TODO: ...

    var saved_cart = Storage.read("cart");
    if(saved_cart){
        Cart=saved_cart;
    }
    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage
    Storage.write("cart", Cart);
    //Очищаємо старі піци в кошику
    $cart.html("");

    var total =0;
    var amount = ;
    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var pizza = cart_item.pizza;
        var size = cart_item.size;

        total += pizza[size].price*cart_item.quantity;

        var $node = $(html_code);

        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;
            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".minus").click(function () {
            cart_item.quantity -= 1;
            if(cart_item.quantity==0) {
                removeFromCart(cart_item);

            }
            updateCart();
        });

        $node.find(".count-clear").click(function () {
            removeFromCart(cart_item);
            updateCart();
        });


        $cart.append($node);
    }

    Cart.forEach(showOnePizzaInCart);
    $(".sum-number").text(total + " грн");
}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.clearCart = clearCart;

exports.PizzaSize = PizzaSize;
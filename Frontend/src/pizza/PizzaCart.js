/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');

var Storage = require('./Storage');

var API = require('../API');

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
        if (Cart[i].pizza.id == pizza.id && Cart[i].size == size) {
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
        if(Cart[i].id==cart_item.id) {
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
    if(saved_cart) {
        Cart = saved_cart;
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

    var total = 0;
    var amount = Cart.length;

    //Онволення однієї піци

    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var pizza = cart_item.pizza;
        var size = cart_item.size;

        total += pizza[size].price * cart_item.quantity;

        var $node = $(html_code);


        $node.find(".plus").click(function () {
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;
            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".minus").click(function () {
            cart_item.quantity -= 1;
            if (cart_item.quantity == 0) {
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

    if (Cart.length == 0) {
        $(".back-badge").attr('hidden', false);
        $(".sum-title").attr('hidden', true);
        $(".button-order").prop('disabled', true);
        $(".sum-number").attr('hidden', true);
        $(".orders-count-span").text(amount);
    }
    else {
        $(".back-badge").attr('hidden', true);
        $(".sum-title").attr('hidden', false);
        $(".sum-title").text("Сума замовлення");
        $(".sum-number").attr('hidden', false);
        $(".sum-number").text(total + " грн");
        $(".orders-count-span").text(amount);
        $(".button-order").prop('disabled', false);
    }
    if(window.location == "http://localhost:5050/order.html"){

        $('.price-box').attr('hidden', true);
        $('.price-box-order').attr('hidden', false);
    }else{
        $('.price-box').attr('hidden', false);
        $('.price-box-order').attr('hidden', true);
    }


}






exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.clearCart = clearCart;

exports.PizzaSize = PizzaSize;

//exports.createOrder = createOrder;
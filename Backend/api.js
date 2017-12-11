/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List');

exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};

exports.createOrder = function(req, res) {
    var order_info = req.body;
    console.log("Creating Order", order_info);

    res.send({
        success: true,
        name: order_info.name,
        pizzas: order_info.order.length

    });
};
//private kluch, base64, sha1, вар ордер, вар дата, сигантюр, var data: data, var signature: signature
//var description передать
//
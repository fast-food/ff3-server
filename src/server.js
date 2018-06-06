var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({	extended: true }));
const typeFilePath = __dirname + "/" + "../data/type.json";
const foodFilePath = __dirname + "/" + "../data/food.json";
const menuFilePath = __dirname + "/" + "../data/menu.json";
var type, food, menu;

fs.readFile(typeFilePath, 'utf8', function (err, data) {
    if (!err) {
        type = JSON.parse(data);
    }
});

fs.readFile(foodFilePath, 'utf8', function (err, data) {
    if (!err) {
        food = JSON.parse(data);
    }
});

fs.readFile(menuFilePath, 'utf8', function (err, data) {
    if (!err) {
        menu = JSON.parse(data);
    }
});

app.get('/type', function (req, res) {
    console.log("requested: /type");
    res.end(JSON.stringify(type));
})

app.get('/menu', function (req, res) {
    console.log("requested: /menu");
    res.end(JSON.stringify(menu));
})

app.get('/food', function (req, res) {
    console.log("requested: /food");
    res.end(JSON.stringify(food));
})

app.post('/order', function (req, res) {
    console.log("requested: /order");
    if(req.body.hasOwnProperty('order')){
        var order = JSON.parse(req.body.order);
        console.log("Menu "+order["menu_id"]);
        for(var i in order["food_ids"]){
            f = getFoodById(order["food_ids"][i])
            if(f!=null){
                console.log("\t"+f["name"]);
            }
        }
        res.end();
    }
    else{
        res.status(500).send("You must specify the following fields: \"order\"");
    }
})

var server = app.listen(8080, function () {
    var port = server.address().port
    console.log("Server listening at http://127.0.0.1:%s", port)
})

function getFoodById(id){
    for(var i in food){
        if(food[i]["id"]==id){
            return food[i]
        }
    }
    return null
}

var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({	extended: true }));
const foodFilePath = __dirname + "/" + "../data/food.json";
const menuFilePath = __dirname + "/" + "../data/menu.json";

app.get('/menu', function (req, res) {
    console.log("requested: /menu");
    fs.readFile(menuFilePath, 'utf8', function (err, data) {
        if (!err) {
            data = JSON.parse(data);
            res.end(JSON.stringify(data));
        }
        else{
            res.status(500).send("Could not get data");
        }
    });
})

app.get('/food', function (req, res) {
    console.log("requested: /food");
    fs.readFile(foodFilePath, 'utf8', function (err, data) {
        if (!err) {
            data = JSON.parse(data);
            res.end(JSON.stringify(data));
        }
        else{
            res.status(500).send("Could not get data");
        }
    });
})

app.post('/food/add', function (req, res) {
    console.log("requested: /food/add");
    if(req.body.hasOwnProperty('name') && req.body.hasOwnProperty('type')){
        var name = req.body.name;
        var type = parseInt(req.body.type);
        fs.readFile(foodFilePath, 'utf8', function (err, data) {
            if (!err) {
                data = JSON.parse(data);
                var index = Object.keys(data).length - 1;
                var id = data[index].id + 1;
                data.push({"id":id, "type":type, "name":name});
                fs.writeFile(foodFilePath, JSON.stringify(data, null, 4), 'utf8', function (err) {
                    if(!err) {
                        res.end();
                    }
                    else{
                        res.status(500).send("Could not write data");
                    }
                });
            }
            else{
                res.status(500).send("Could not read data");
            }
        });
    }
    else{
        res.status(500).send("You must specify the following fields: \"name\", \"type\"");
    }
})

app.post('/menu/add', function (req, res) {
    console.log("requested: /menu/add");
    if(req.body.hasOwnProperty('price') && req.body.hasOwnProperty('food_type')){
        var price = parseFloat(req.body.price);
        var foodType = JSON.parse(req.body.food_type);
        fs.readFile(menuFilePath, 'utf8', function (err, data) {
            if (!err) {
                data = JSON.parse(data);
                data.push({"price":price, "food_type":foodType});
                fs.writeFile(menuFilePath, JSON.stringify(data, null, 4), 'utf8', function (err) {
                    if(!err) {
                        res.end();
                    }
                    else{
                        res.status(500).send("Could not write data");
                    }
                });
            }
            else{
                res.status(500).send("Could not read data");
            }
        });
    }
    else{
        res.status(500).send("You must specify the following fields: \"name\", \"food_type[]\"");
    }
})

var server = app.listen(8080, function () {
    var port = server.address().port
    console.log("Server listening at http://127.0.0.1:%s", port)
})

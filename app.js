/*********************************************************************************
 * ITE5315 – PROJECT * 
 * I declare that this assignment is my own work in accordance with Humber Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source 
 * (including web sites) or distributed to other students. * 
 * Group member Name: HEMANT KUMAR KANSAL Student ID: N01468035 Date: 10.04.2022 *
 * Group member Name: KIRUTHIKA SUNDARARAJAN Student ID: N01414462 Date: 10.04.2022 *
 * ********************************************************************************/

var express = require('express');
var db = require('./config/db');
var database = require('./config/database');
var Restaurant = require('./models/restaurant');
var bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
var path = require('path');
const { celebrate, Joi, errors, Segments } = require('celebrate');
var port = process.env.PORT || 8000;
var app = express();

// Registering and setting template engine
app.engine('.hbs', exphbs.engine({ 
    extname: 'hbs',
    helpers: {
        decimal2: function(options){
          return  parseFloat(options.fn(this)).toFixed(2) ;
        }
    } 
}));

app.set('view engine', '.hbs');

app.use(bodyParser.urlencoded({ 'extended': 'true' }));

// Assigning public folder to access static files like CSS and images
app.use(express.static(path.join(__dirname, 'public')));

// Initializing connection with Database
db.initialize(database.url);

// Creating a restaurant and saving it to the database
app.post("/api/restaurants", (req, res) => {
    var bodyData = req.body;
    var data = new Restaurant({
        address: {
            building: bodyData.address.building,
            coord: [bodyData.address.coord[0], bodyData.address.coord[1]],
            street: bodyData.address.street,
            zipcode: bodyData.address.zipcode
        },
        borough: bodyData.borough,
        cuisine: bodyData.cuisine,
        grades: [
            {
                date: bodyData.grades[0].date,
                grade: bodyData.grades[0].grade,
                score: bodyData.grades[0].score
            },
            {
                date: bodyData.grades[1].date,
                grade: bodyData.grades[1].grade,
                score: bodyData.grades[1].score
            }
        ],
        name: bodyData.name,
        restaurant_id: bodyData.restaurant_id
    });

    const status = db.addNewRestaurant(data);
    status.then(result => res.send(result));
})

// Validating params and upon validation, showing restaurants.
// Selection would be based on "borough" (if passed)
// Only (perPage) restaurants would be shown from page no. "page"
app.get("/api/restaurants", celebrate({
    [Segments.QUERY]: Joi.object().keys({
        page: Joi.number().integer().required(),
        perPage: Joi.number().integer().required(),
        borough: Joi.string()
    }),
}),
    (req, res) => {
        var page = req.query.page;
        var perPage = req.query.perPage;
        var borough = req.query.borough;
        const restaurants = db.getAllRestaurants(page, perPage, borough);
        restaurants.then(result => res.send(result));
    }
)

// Showing restaurant by _id
app.get("/api/restaurants/:_id", (req, res) => {
    var id = req.params._id;

    const restaurant = db.getRestaurantById(id);
    restaurant.then(result => res.send(result));
})

// Updating restaurant by _id
app.put("/api/restaurants/:_id", (req, res) => {
    var id = req.params._id;
    var bodyData = req.body;
    var data = {
        address: {
            building: bodyData.address.building,
            coord: [bodyData.address.coord[0], bodyData.address.coord[1]],
            street: bodyData.address.street,
            zipcode: bodyData.address.zipcode
        },
        borough: bodyData.borough,
        cuisine: bodyData.cuisine,
        grades: [
            {
                date: bodyData.grades[0].date,
                grade: bodyData.grades[0].grade,
                score: bodyData.grades[0].score
            },
            {
                date: bodyData.grades[1].date,
                grade: bodyData.grades[1].grade,
                score: bodyData.grades[1].score
            }
        ],
        name: bodyData.name,
        restaurant_id: bodyData.restaurant_id
    };

    const status = db.updateRestaurantById(data, id);
    status.then(result => res.send(result));
})

// Deleting restaurant by _id
app.delete("/api/restaurants/:_id", (req, res) => {
    var id = req.params._id;

    const status = db.deleteRestaurantById(id);
    status.then(result => res.send(result));
});

// UI for retrieving restaurants based on page, perPage and borough
app.get("/restaurants", (req, res) => {
    res.render('webform', {
        layout: "main",
        title: "Restaurants: Search"
    })
});

// Middleware for submission of UI web form
// This middleware would show Only (perPage) restaurants from page no. "page"
app.post("/restaurants", celebrate({
    [Segments.BODY]: Joi.object().keys({
        page: Joi.number().integer().required(),
        perPage: Joi.number().integer().required(),
        borough: Joi.string().allow(null).allow('').optional(),
        submit: Joi.string(),
        clear: Joi.string()
    }),
}),
    (req, res) => {
        var page = req.body.page;
        var perPage = req.body.perPage;
        var borough = req.body.borough;

        const restaurants = db.getAllRestaurants(page, perPage, borough);
        restaurants.then(result => res.render('restaurants', {
            layout: "main",
            title: "Restaurants",
            data:  result.map(rs => rs.toJSON())
        }));
    }
)

// Showing error for wrong params in /api/restaurants
app.use(errors());

app.use((req, res) => {
    res.status(404).send("<h3 style='color:red'>404 Error!!! No Data found!</h3>")
})

app.listen(port, err => {
    if (err) console.log("Error!");
    console.log("Server listening on PORT", port);
})
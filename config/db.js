var mongoose = require('mongoose');
var Restaurant = require('../models/restaurant');

module.exports = {
    initialize: function (url) {
        // Creating connection with MongoDB Atlas
        mongoose.connect(url)
            .then(() => console.log("Connection Created successfully !!!"))
            .catch((err) => {
                console.log(`There was an error: ${err}`);
            });
    },
    addNewRestaurant: function (restaurant) {
        // create and save the restaurant
        var status = restaurant.save()
            .then(() => { return "Restaurant has been added to the database successfully !!!" })
            .catch((err) => { return err });

        return status;
    },
    getAllRestaurants: function (page, perPage, borough) {
        // create and save the restaurant
        var restaurants;
        if((borough == null) || (borough == "")){
            restaurants = Restaurant.find()
            .sort({ restaurant_id: -1 })
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec()
            .then(restaurants => { return restaurants })
            .catch((err) => { return err });
        }
        else{
            restaurants = Restaurant.find()
            .sort({ restaurant_id: -1 })
            .where('borough').equals(borough)
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec()
            .then(restaurants => { return restaurants })
            .catch((err) => { return err });
        }

        return restaurants;
    },
    getRestaurantById: function (Id) {
        var restaurant = Restaurant.findById(Id)
            .exec()
            .then(restaurant => {return restaurant})
            .catch((err) => { return err });

        return restaurant;
    },
    updateRestaurantById: function (data, Id) {
        var status = Restaurant.findByIdAndUpdate(Id, data)
            .exec()
            .then(() => {return `Restaurant with _id = "${Id}"  has been updated successfully !!!`})
            .catch((err) => { return err });
        
        return status;
    },
    deleteRestaurantById: function (Id) {
        var status = Restaurant.findByIdAndDelete(Id)
            .exec()
            .then(() => {return `Restaurant with _id = "${Id}" has been deleted successfully !!!`})
            .catch((err) => { return err });

        return status;
    }
}
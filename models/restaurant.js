/*********************************************************************************
 * ITE5315 – Project * 
 * I declare that this assignment is my own work in accordance with Humber Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source 
 * (including web sites) or distributed to other students. * 
 * Name: HEMANT KUMAR KANSAL Student ID: N01468035 Date: 07.04.2022 *
 * ********************************************************************************/

//  load mongoose since we need it to define a model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
restaurantSchema = new Schema({
    address: {
        building: String,
        coord: [Number],
        street: String,
        zipcode: String,
    },
    borough: String,
    cuisine: String,
    grades: [
        {
            date: Date,
            grade: String,
            score: Number
        }
    ],
    name: String,
    restaurant_id: String
});
module.exports = mongoose.model('restaurants', restaurantSchema);
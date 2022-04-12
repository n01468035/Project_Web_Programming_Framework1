 /*********************************************************************************
 * ITE5315 – PROJECT * 
 * I declare that this assignment is my own work in accordance with Humber Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source 
 * (including web sites) or distributed to other students. * 
 * Group member Name: HEMANT KUMAR KANSAL Student ID: N01468035 Date: 10.04.2022 *
 * Group member Name: KIRUTHIKA SUNDARARAJAN Student ID: N01414462 Date: 10.04.2022 *
 * ********************************************************************************/

const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

var db = "sample_restaurants";
 module.exports = {
     url : `mongodb+srv://${process.env.USRNAME}:${process.env.PASSWORD}@cluster0.afg20.mongodb.net/${db}`
 };
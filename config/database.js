 var credentials  = require('../../credentials');
 var db = "sample_restaurants";
 
 module.exports = {
     url : `mongodb+srv://${credentials.Username}:${credentials.Password}@cluster0.afg20.mongodb.net/${db}`
 };
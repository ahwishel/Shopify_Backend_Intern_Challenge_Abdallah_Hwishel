//Define an Warehouse for the inventory database
const {model,Schema} = require('mongoose')

/*
Warehouse:
    Name: Name of the warehouse that's visible on the front-end
    Address: Address of the warehouse
*/
const Warehouse = new Schema({
    name: {type: String, required: true},
    address: {type: String, required: true}
})

module.exports = model('Warehouse', Warehouse);
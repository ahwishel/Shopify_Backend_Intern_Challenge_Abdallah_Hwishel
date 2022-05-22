/*
Define an Item for the inventory database
*/
const {model,Schema} = require('mongoose')

/*
Item:
    Name: Name of the Item that's visible on the front-end
    Quantity: The amount of items held at the current warehouse
    Address: Address that the item is stored at (typically that of a warehouse)
    Date Added: The date in which the item was added
    Description: A prose describing the item
*/
const Item = new Schema({
    name: {type: String, required: true},
    quantity: {type: Number, required: true, min: 0},
    address: {type: String, required: true},
    date_added: {type: Date, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: false}
})

module.exports = model('Item', Item);
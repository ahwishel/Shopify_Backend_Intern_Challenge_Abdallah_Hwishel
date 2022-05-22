const {Router} = require('express')
const router = Router() //Allows me to define routes for server
const Item = require('../Models/Item')
const Warehouse = require('../Models/Warehouse')

//Retrieve list of warehouses
router.get('/get_warehouses', (request, response) => {
    Warehouse.find((err, result) => {
        if(err){
            response.status(500).send({error:true, err:err})
        } else {
            response.json(result)
        }
    })
})

//Read inventory (for a given factory, provided by frontend as part of body)
router.get('/get_inventory/:address', (request, response) => {
    //Retrieve only items pertaining to the current warehouse address,
    //where the address is selected from a list of warehouse addresses.
    let data = request.params.address.split("_").join(' ')
    Item.find({address: data}, (err, result) => {
        if(err){
            response.status(500).send(`Could not find items warehouse at ${request.body.address}`)
        } else {
            response.json(result) //Return the result in a json format
        }
    })
})

//Update an inventory item
router.put('/update_item', (request, response) => {
    
    let data = JSON.parse(Object.keys(request.body)[0])
    const itemName = data.name
    const address = data.address

    //If any of those are null mongo doesn't update those fields in the document
    const newInfo = {
        name: data.new_name,
        quantity: data.new_quantity,
        //From drop down on front-end
        address: data.new_address,
        description: data.new_description,
        price: data.new_price
    }

    //Find item with the provided name, and address, and update the given info
    Item.updateOne({name: itemName, address: address},{$set: newInfo})
        .then((writeResult) => {
            if(writeResult.matchedCount >= 1){
                return response.status(200).send({itemUpdated: true})
            } else {
                return response.status(500).send({itemUpdated: false, foundItem: false})
            }
        })
        .catch(err => {
            console.log(err)
            response.status(500).send({itemUpdated: false, dbError: true})
        })
})

//Delete an inventory item
router.delete('/delete_item', (request, response) => {
    //Used to find item. I find by address as well in case different warehouses have the same item
    console.log(request.body)
    let data = JSON.parse(Object.keys(request.body)[0])
    console.log(data)

    //Find one item
    Item.deleteOne(data).then(writeResult => {
        if(writeResult.deletedCount === 1){
            return response.status(200).send({itemDeleted: true})
        } else {
            response.status(500).send({itemDeleted: false, foundItem: false})
        }
    })
    .catch(err => {
        console.log(err)
        response.status(500).send({itemDeleted: false, dbError: true})
    })
})

//Create a new item in inventory
router.put('/create_item', (request, response) => {
    let data = JSON.parse(Object.keys(request.body)[0])
    console.log(data)
    let newItem = new Item(data)
    newItem.save()
           .then(() => response.status(201).json({itemCreated: true}))
           .catch(err => {
                console.log(err)
                response.status(500).json({itemCreated: false})
           })
})

//Create a new warehouse
router.put('/create_warehouse', (request, response) => {
    let data = JSON.parse(Object.keys(request.body)[0])
    let newWarehouse = new Warehouse(data)
    newWarehouse.save()
                .then(() => response.status(201).json({warehouseAdded: true}))
                .catch(err => {
                    console.log(err)
                    response.status(500).json({warehouseAdded: false})
                })
})

module.exports = router

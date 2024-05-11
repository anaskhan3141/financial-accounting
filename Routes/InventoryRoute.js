const express = require ('express')
const router = express.Router()
const inventoryController = require('../Controllers/InventoryController')

router.post('/addToInventory', inventoryController.addToInventory)
router.post('/returnInventory', inventoryController.returnInventory)
router.get('/getAllItems', inventoryController.getAllItemsFromInventory)
router.put('/updateItem', inventoryController.updateItemInInventory)
router.delete('/deleteItem', inventoryController.deleteItemFromInventory)
// router.post('/sale', inventoryController.sale)



module.exports = router
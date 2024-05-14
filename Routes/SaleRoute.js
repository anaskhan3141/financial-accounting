const express = require('express')
const router = express.Router()
const saleContoller = require('../Controllers/SaleController')

router.post('/sellItem', saleContoller.sellItem)
router.post('/saleReturn', saleContoller.saleReturn)


module.exports = router
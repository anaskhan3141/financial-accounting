const express = require('express')
const accountsController = require('../Controllers/AccountsController')

const router = express.Router()

router.post('/createAccount', accountsController.createAccount)
router.get('/getAccountDetails', accountsController.getAccountDetails)
router.get('/getAllAccountDetails', accountsController.getAllAccountDetails)



module.exports = router
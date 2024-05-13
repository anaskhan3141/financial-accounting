const express = require('express')
const accountsController = require('../Controllers/AccountsController')

const router = express.Router()

router.post('/createAccount', accountsController.createAccount)
router.get('/getAccountDetails', accountsController.getAccountDetails)
router.get('/getAllAccountDetails', accountsController.getAllAccountDetails)
router.get('/getAllAccounts', accountsController.getAllAcountNames)



module.exports = router
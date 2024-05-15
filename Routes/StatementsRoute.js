const express = require('express')
const router = express.Router();
const statementController = require('../Controllers/StatementController')

router.get('/income', statementController.income)
router.get('/balanceSheet', statementController.balanceSheet)


module.exports = router;

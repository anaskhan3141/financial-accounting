const express = require('express')
const router = express.Router()

const journalController = require('../Controllers/JournalController')


router.post('/post', journalController.post)
router.get('/getEntry', journalController.getEntry)
router.get('/getAllEntries', journalController.getAllEntries )

module.exports = router

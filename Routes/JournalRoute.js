const express = require('express')
const router = express.Router()

const journalController = require('../Controllers/JournalController')


router.post('/post', journalController.post)
router.get('/getEntry', journalController.getEntry)
router.get('/getAllEntries', journalController.getAllEntries )
router.delete('/deleteAllEntries', journalController.deleteAllEntries)

module.exports = router

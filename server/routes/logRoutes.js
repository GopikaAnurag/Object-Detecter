const express = require('express')
const router = express.Router()
const {createLog,getLog} = require('../controller/logController')


router.post('/',createLog)
router.get('/',getLog)

module.exports = router
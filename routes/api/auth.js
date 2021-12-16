const router = require('express').Router()

const auth = require('../../controllers/api/authController')

router.get('/', auth.index)

router.post('/register', auth.register)

module.exports = router
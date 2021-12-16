const router = require('express').Router()

const auth = require('../../controllers/api/authController')
const restrict = require('../../middlewares/restrict')

router.get('/', auth.index)

router.post('/register', auth.register)
router.post('/login', auth.login)
router.post('/test', auth.testAuthenticate)
router.post('/whoami', restrict, auth.whoami)

module.exports = router
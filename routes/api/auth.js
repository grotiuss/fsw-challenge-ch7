const router = require('express').Router()

const auth = require('../../controllers/api/authController')
const restrict = require('../../middlewares/restrict')

router.get('/', auth.index)

router.post('/register', auth.register)
router.post('/login', auth.login)
router.post('/login-token', restrict, auth.loginToken)


// router.post('/test', auth.testAuthenticate)

module.exports = router
const router = require('express').Router()
const restrict = require('../middlewares/restrict')

const game = require('../controllers/api/gameController')

router.get('/', (req, res) => {
    res.status(200).json(
        { msg: 'gameRouter is active' }
    )
})

router.post('/create-room', restrict, game.createRoom)
router.post('/join-room', restrict, game.joinRoom)
// router.post('/fight/room_id', restrict, game.fightRoom)
router.post('/fight/:room_id', restrict, game.fightRoom)
router.post('/fight', game.fightRoomInvalid)

router.post('/view-room', game.viewRoom)

module.exports = router
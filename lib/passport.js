const passport = require('passport')

const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt')

const { User } = require('../models')

const options = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: 'aslkdmwjk13j4k32nkmlfaoijas'
}

passport.use(new JwtStrategy (options, async (payload, done) => {
    return done(null, payload)
    // User.findByPk(payload.id)
    //     .then(user => {
    //         console.log(payload.username)
    //         return done(null, user)
    //     })
    //     .catch(err => {
    //         console.log(payload.username)
    //         return done(null, {
    //             msg: 'Error passport'
    //         })
    //     })
}))

module.exports = passport
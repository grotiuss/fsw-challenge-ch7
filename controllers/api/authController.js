const { 
    User
 } = require('../../models')

 const format = (user) => {
    const { id, username, asAdmin } = user
    return {
        id,
        username,
        asAdmin,
        accessToken: user.generateToken()
    }
}

module.exports = {
    index: (req, res) => {
        res.status(200).send('authController is active :)')
    },
    register: async(req, res) => {
        try {
            const input = {
                username: req.body.username,
                password: req.body.password,
            }
            await User.register(input)
                .then((user) => {
                    res.status(200).json({
                        username: user.username,
                        msg: 'Account has been created. Congratulations!'
                    })
                })
        } catch (error) {
            res.status(500).json({
                msg: 'Fail to create the account. Check the authController!'
            })
        }
        // res.status(200).json(input)
    },
    login: (req, res) => {
        const input = {
            username: req.body.username,
            password: req.body.password
        }
        User.authenticate(input)
            .then(user => {
                res.status(200).json(format(user))
            })
    },
    loginToken: (req, res) => {
        // res.status(200).json({ msg: 'whoami controller is active' })
        const result = {
            id: req.user.id,
            username: req.user.username,
            iat: req.user.iat,
            message: "You are logged in!"
        }
        res.status(200).json(result)
    }
    // testAuthenticate: async(req, res) =>{
    //     try {
    //         const input = {
    //             username: req.body.username,
    //             password: req.body.password
    //         }
    //         await User.authenticate(input)
    //             .then((user) => {
    //                 res.status(200).json(user)
    //             })
    //         // res.status(200).json(input)
    //     } catch (error) {
    //         res.status(500).json({
    //             error: '500',
    //             msg: 'Fail to authenticate the account. Check the testAuthenticate methode in authController!'
    //         })
    //     }
    // }
}
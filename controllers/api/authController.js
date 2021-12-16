const { 
    User
 } = require('../../models')

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
    }
}
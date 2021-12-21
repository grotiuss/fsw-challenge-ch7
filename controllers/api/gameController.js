const { User, User_game_history, Game_room } = require('../../models')

//For debugging only :D
const error_json = (number, msg) => {
    return {
        error: number,
        destinantion: './controllers/gameController',
        msg
    }
}

module.exports = {
    createRoom: async(req, res) => {
        try {
            const isExist = await Game_room.findOne({ where: { room_name: req.body.room_name } })
            if(isExist) return res.status(200).json(
                {
                    room_name: req.body.room_name,
                    msg: 'room_name is already used.'
                }
            )

            const input = {
                room_name: req.body.room_name,
                player_1_id: req.user.id,
                player_2_id: null
            }
            const newRoom = await Game_room.create(input)

            //create gameRound
            // const rounds = [1,2,3]
            // rounds.forEach(async(round) => {
            //     const result = await User_game_history.create({
            //         room_id: newRoom.id,
            //         round: round,
            //         player_1_pick: null,
            //         player_2_pick: null,
            //         round_winner: null
            //     })
            // })

            round = 1
            while(round<=3) {
                await User_game_history.create({
                    room_id: newRoom.id,
                    round: round,
                    player_1_pick: null,
                    player_2_pick: null,
                    round_winner: null
                })
                    .then(() => round = round + 1)
            }

            //showing gameRound
            const gameRound = await User_game_history.findAll({ 
                where: { room_id: newRoom.id } ,
                include: { model: Game_room }
            })
            res.status(200).json(gameRound)
        } catch (error) {
            res.status(500).json(
                { msg: 'createRoom method in gameController is error' }
            )
        }
    },
    viewRoom: async(req, res) => {
        try {
            const room_id = 1
            const detail = await Game_room.findOne({ where: { id: room_id }})
            var detail_player = [
                await User.findOne({ 
                    where: { id: detail.player_1_id }, 
                    attributes : ['id', 'username']
                }),
                await User.findOne({ 
                    where: { id: detail.player_2_id }, 
                    attributes : ['id', 'username']
                })
            ]
            res.status(200).json(detail_player[0])
            // res.status(200).json({ msg: 'viewRoom method in gameController is active.' })
        } catch (error) {
            res.status(500).json(error_log(500, 'viewRoom method is error.'))
        }
    },
    joinRoom: async(req, res) => {
        try {
            const findRoom = await Game_room.findOne({ where: { room_name: req.body.room_name } })
            //Jika room tidak ditemukan 
            if(!findRoom) {
                return res.status(400).json({   
                    msg: 'Room not found!'
                })
            }


            //Jika sudah masuk ke dalam room
            if (findRoom.player_1_id == req.user.id || findRoom.player_2_id == req.user.id ) {
                return res.status(200).json({
                    id: req.user.id,
                    username: req.user.username,
                    msg: 'You have already joined this room.'
                })
            }
            //Jika room sudah penuh
            if(findRoom.player_2_id) {
                return res.status(200).json({
                    room_name: findRoom.room_name,
                    msg: 'Room is full.'
                })
            }

            const input = {
                player_2_id: req.user.id,
            }
            await Game_room.update(input, { where: { room_name: findRoom.room_name } })
                .then( result => {
                    res.status(200).json({
                        msg: 'Join success.'
                    })
                })

        } catch (error) {
            res.status(500).json(
                { msg: 'joinRoom method in gameController is error' }
            )
        }
    },
    fightRoomInvalid: (req, res) => {
        try { 
            res.status(200).json(
                { msg: 'fightRoomInvalid method in gameController is active' }
            )

        } catch (error) {
            res.status(500).json({
                destination : './controllers/gameController.js',
                msg: 'fightRoomInvalid method in gameController is error'
            })
        }
    },
    fightRoom: async(req, res) => {
        try {
            var input = {
                roomId: req.params.room_id,
                user: req.user.id,
                pick: req.body.pick
            }

            //Before
            const findGame_ = await User_game_history.findAll({
                where: { room_id: input.roomId },
                attributes: ['round', 'round_winner', 'player_1_pick', 'player_2_pick']
            })
            findGame_.sort((a,b) => a.round - b.round) //Sorting round 
            const findGame = findGame_.map(game => {
                var round_winner = ''
                if(game.round_winner == 0){
                    round_winner = 'DRAW'
                } else if(game.round_winner == 1){
                    round_winner = 'Player 1'
                } else if(game.round_winner == 2){
                    round_winner = 'Player 2'
                } else {
                    round_winner = null
                }
                
                return {
                    round: game.round,
                    round_winner: round_winner,
                    player_1_pick: game.player_1_pick,
                    player_2_pick: game.player_2_pick
                }
            })

            const findRoom = await Game_room.findByPk(input.roomId)
            var result = {
                roomId: input.roomId,
                roomName: findRoom.room_name,
                onGoingRound: 0,
                yourRole: 0,
                gameHistory: findGame,
            }
            // ---------------------------------------------------------

            //Penentuan role
            if(findRoom.player_1_id == input.user) result.yourRole = 1
            else result.yourRole = 2

            //JIka game masih berada di ronde 1
            if(result.gameHistory[0].player_1_pick == null || result.gameHistory[0].player_2_pick == null) {
                result.onGoingRound = 1
            }
            //JIka game masih berada di ronde 2
            else if(result.gameHistory[1].player_1_pick == null || result.gameHistory[1].player_2_pick == null) {
                result.onGoingRound = 2
            }
            //JIka game masih berada di ronde 3
            else if(result.gameHistory[2].player_1_pick == null || result.gameHistory[2].player_2_pick == null) {
                result.onGoingRound = 3
            }
            //JIka game selesai
            else {
                var finalResult = {
                    roomId: input.roomId,
                    roomname: findRoom.room_name,
                    announcement: 'GAME WAS DONE! CONGRATULATIONS TO ',
                    gameHistory : findGame
                }

                //Counting score
                const scoreResults = await User_game_history.findAll({
                    where: {
                        room_id: input.roomId
                    },
                    attributes: ['round','round_winner']
                })
                var player_1_win = 0
                var player_2_win = 0

                scoreResults.forEach(scoreResult => {
                    if(scoreResult.round_winner == 1) {
                        player_1_win  = player_1_win + 1
                    } else if (scoreResult.round_winner == 2) {
                        player_2_win = player_2_win + 1
                    }
                })

                if(player_1_win == player_2_win) {
                    finalResult.announcement = 'GAME DRAW!!'
                } else if(player_1_win > player_2_win) {
                    finalResult.announcement = finalResult.announcement + 'PLAYER 1'
                } else {
                    finalResult.announcement = finalResult.announcement + 'PLAYER 2'
                }

                //Calculating result
                return res.status(200).json(finalResult)
            }

            //Periksa inputan
            if(!(input.pick == 'R' || input.pick == 'S' || input.pick == 'P' || input.pick == 'r' || input.pick == 's' || input.pick == 'p')){
                var result = {
                    roomId: input.roomId,
                    roomName: findRoom.room_name,
                    onGoingRound: 0,
                    yourRole: 0,
                    warning: 'Invalid input. You have to pick R (rock) or P (paper) or S (scissor)',
                    gameHistory: findGame
                }
                return res.status(200).json(result)
            }
            if(input.pick == 'r' || input.pick == 's' || input.pick == 'p') {
                const converted = input.pick.toUpperCase()
                input.pick = converted
            }

            
            const player  = result.yourRole
            //Checking turn
            if(result.yourRole == 1 && result.gameHistory[result.onGoingRound - 1].player_1_pick != null)
            {
                return res.status(200).json({
                    roomId: input.roomId,
                    roomName: findRoom.room_name,
                    warning: "Waiting for opponent's turn",
                    onGoingRound: result.onGoingRound,
                    yourRole: player,
                    gameHistory: findGame
                })
            }

            if(result.yourRole == 2 && result.gameHistory[result.onGoingRound - 1].player_2_pick != null)
            {
                return res.status(200).json({
                    roomId: input.roomId,
                    roomName: findRoom.room_name,
                    warning: "Waiting for opponent's turn",
                    onGoingRound: result.onGoingRound,
                    yourRole: player,
                    gameHistory: findGame
                })
            }

            //Choosing
            if(player == 1) {
                await User_game_history.update(
                {
                    player_1_pick: input.pick
                }, 
                {
                    where: {
                        room_id: input.roomId,
                        round: result.onGoingRound
                    }
                })
            } else {
                await User_game_history.update(
                    {
                        player_2_pick: input.pick
                    }, 
                    {
                        where: {
                            room_id: input.roomId,
                            round: result.onGoingRound
                        }
                    })
            }

            //After
            const findGame1 = await User_game_history.findAll({
                where: { room_id: input.roomId },
                attributes: ['round', 'player_1_pick', 'player_2_pick']
            })
            findGame1.sort((a,b) => a.round - b.round) //Sorting round 
            var result1 = {
                roomId: input.roomId,
                roomName: findRoom.room_name,
                round: result.onGoingRound,
                yourRole: result.yourRole,
                gameHistory: findGame1
            }
            // ----------------------------------------------------

            //Updating round winner (jika player pick sudah lengkap)
            if(findGame1[result1.round - 1].player_1_pick && findGame1[result1.round - 1].player_2_pick) {
                if(findGame1[result1.round - 1].player_1_pick == findGame1[result1.round - 1].player_2_pick) //DRAW
                { 
                    await User_game_history.update(
                        {
                            round_winner: 0
                        },
                        {
                        where: {
                            room_id: input.roomId,
                            round: result.onGoingRound
                        }
                    })
                } else {
                    if((findGame1[result1.round - 1].player_1_pick == 'R' && findGame1[result1.round - 1].player_2_pick == 'S' ) || 
                        (findGame1[result1.round - 1].player_1_pick == 'P' && findGame1[result1.round - 1].player_2_pick == 'R') || 
                        (findGame1[result1.round - 1].player_1_pick == 'S' && findGame1[result1.round - 1].player_2_pick == 'P')) {
                            await User_game_history.update(
                                {
                                    round_winner: 1
                                },
                                {
                                where: {
                                    room_id: input.roomId,
                                    round: result.onGoingRound
                                }
                            })
                        }
                    else {
                        await User_game_history.update(
                            {
                                round_winner: 2
                            },
                            {
                            where: {
                                room_id: input.roomId,
                                round: result.onGoingRound
                            }
                        })
                    }
                }
            }

            //Update Game_room winner jika roundWinner sudah lengkap
            return res.status(200).json(result1)
            
            // res.status(200).json({ msg: 'fightRoom method in gameController is active :D' })
        } catch (error) {
            res.status(500).json(error_json(500, 'fightRoom method in gameController is error.'))
        }
    }
}
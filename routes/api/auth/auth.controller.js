const jwt = require('jsonwebtoken')
const User = require('../../../models/user')

/*
    POST /api/auth
    {
        username,
        password
    }
*/

exports.register = (req, res) => {
    const {username, password} = req.body
    let newUser = null

    //존재하지 않으면 새 사용자 생성
    const create = (user) => {
        if (user) {
            throw new Error('username exists')
        } else {
            return User.create(username, password)
        }
    }

    //사용자 수 세기
    const count = (user) => {
        newUser = user
        return User.count({}).exec()
    }

    const assign = (count) => {
        if (count === 1) {
            //첫 생성자는 관리자로 할당하여 반환
            return newUser.assignAdmin()
        } else {
            //아니면 false를 반환
            return Promise.resolve(false)
        }
    }

    //client 에게 응답
    const respond = (isAdmin) => {
        res.json({
            message: 'registered successfully',
            admin: isAdmin ? true : false
        })
    }

    //에러가 발생 했을 때
    const onError = (error) => {
        res.status(409).json({
            message: error.message
        })
    }

    //username 중복 확인
    User.findOneByUsername(username)
        .then(create)
        .then(count)
        .then(assign)
        .then(respond)
        .catch(onError)
}
/*
    POST /api/auth/login
    {
        username,
        password
    }
*/
exports.login = (req, res) => {
    const {username, password} = req.body
    const secret = req.app.get('jwt-secret')

    //사용자 정보를 확인하고 jwt를 생성
    const check = (user) => {
        if (!user) {
            //사용자가 존재하지 않으면
            throw new Error('login failed')
        } else {
            //사용자가 존재한다면, 비밀번호를 확인한다.
            if (user.verify(password)) {
                //비동기적으로 jwt를 생성하는 약속
                const p = new Promise((resolve, reject) => {
                    jwt.sign(
                        {
                            _id: user._id,
                            username: user.username,
                            admin: user.admin
                        },
                        secret,
                        {
                            expiresIn: '7d',
                            issuer: 'jun.com',
                            subject: 'userInfo'
                        },
                        (err, token) => {
                            if (err) reject(err)
                            resolve(token)
                        }
                    )
                })
                return p
            }
            else{
                throw new Error('login failed')
            }
        }
    }

    //토큰에 응답
    const respond = (token)=>{
        res.json({
            message: 'logged in successfully',
            token
        })
    }

    //에러 발생시
    const onError = (error)=>{
        res.status(403).json({
            message: error.message
        })
    }

    User.findOneByUsername(username)
        .then(check)
        .then(respond)
        .catch(onError)
}

//jwt검증 : 사용자가 x-access-token으로 설정하거나, url parameter 로 서버로 전달하면 서버측에서 그 토큰을 가지고 검증한 후
//현재 계정의 상태를 보여주는 기능
/*
    GET /api/auth/check
*/
exports.check = (req,res) => {
    res.json({
        success: true,
        info: req.decoded
    })

}
// jwt 와 발급 / 검증 작업을 한다.

const jwt = require('jsonwebtoken');

const authMiddleware = (req,res,next)=>{
    // 헤더 또는 url 에서 token 을 읽어온다.
    const token = req.headers['x-access-token'] || req.query.token;

    if(!token){
        return res.status(403).json({
            success: false,
            message: 'not logged in'
        })
    }

    //토큰을 해독하는 약속 생성
    const p = new Promise(
        (resolve,reject) => {
            jwt.verify(token,req.app.get('jwt-secret'),(err,decoded)=>{
                if(err) reject (err);
                resolve(decoded)
            })
        });

    //검증에 실패하면 에러 메시지를 보낸다
    const onError = (error) =>{
        res.status(403).json({
            success: false,
            message: error.message
        })
    };

    //약속 실행
    p.then((decoded)=>{
        req.decoded = decoded;
        next()
    }).catch(onError)

};

module.exports = authMiddleware;
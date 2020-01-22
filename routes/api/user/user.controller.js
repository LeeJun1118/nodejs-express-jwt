const User = require('../../../models/user')
/*
GET/api/user/list
*/

exports.list = (req,res) => {
    //관리자가 아닌 경우 거부
    if(!req.decoded.admin){
        return res.status(403).json({
            message : 'you are not a admin'
        })
    }

    User.find({})
        .then(
            users=>{
                res.json({users})
            }
        )
}

/*
    POST /api/user/assign-admin/:username
*/
exports.assignAdmin = (req,res) => {
    //관리자가 아니면 거부
    if(!req.decoded.admin){
        return res.status(403).json({
            message: 'you are not an admin'
        })
    }

    User.findOneByUsername(req.params.username)
        .then(
            user=>user.assignAdmin
        ).then(
            res.json({
                success: true
            })
    )
}

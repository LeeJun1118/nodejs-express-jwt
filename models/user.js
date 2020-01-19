const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    username : String,
    password : String,
    admin: { type: Boolean, default: false}
});

// 새로운 사용자 문서 작성
User.statics.create = function (username,password) {
    const user = new this({
        username,
        password
    });
    return user.save()
};
// username 으로 사용자를 찾는다.
//findOneByUsername 메소드는 username 값을 사용하여 유저를 찾습니다
User.statics.findOneByUsername = function (username) {
    return this.findOne({
        username
    }).exec()
};

// 사용자 문서의 비밀번호 확인
//verify 메소드는 비밀번호가 정확한지 확인을 합니다
User.methods.verify = function (password) {
    return this.password === password
};

//assignAdmin 메소드는 유저를 관리자 계정으로 설정
User.methods.assignAdmin = function () {
    this.admin = true;
    return this.save()
};

module.exports = mongoose.model('User',User);

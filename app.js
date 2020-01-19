//의존성 로드
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

//config 로드
const config = require('./config');
const port = process.env.PORT || 3000;

//익스프레스 구성
const app = express();

//JSON 및 URL 인코딩 쿼리 파싱
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//콘솔에 request log 프린트
app.use(morgan('dev'));

//jwt의 비밀 키 변수를 설정
app.set('jwt-secret',config.secret);

//테스트용 index페이지
app.get('/',(req,res)=>{
  res.send('Hello JWT')
});

//서버 열기
app.listen(port,()=>{
  console.log('Express is running on port ${port}')
});

// morgan 서버에 연결
mongoose.connect(config.mongodbUri);
const db = mongoose.connection;
db.on('error',console.error);
db.once('open',()=>{
  console.log('connected to mongodb server')
});

const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const naver = require('./naverStrategy');
const google = require('./googleStrategy');
const User = require('../models/user');

module.exports = () => {
    // 로그인 시 실행 ↓
    // session(세션) 객체에 어떤 데이터를 저장할지 정하는 메서드
  passport.serializeUser((user, done) => {
    // done 함수는 실패시 첫번째 인수(null), 성공했을때는 두번째 인수(user.id)
    done(null, user.id);
  });
  // 요청마다 실행 ↓
  passport.deserializeUser((id, done) => {
    User.findOne({ 
      where: { id },
      include: [{
        model: User,
        attributes: ['id', 'nick'],
        as: 'Followers',
      }, {
        model: User,
        attributes: ['id', 'nick'],
        as: 'Followings',
      }],
    })
    .then(user => done(null, user))
    .catch(err => done(err));
  });
  local();
  kakao();
  naver();
  google();
};
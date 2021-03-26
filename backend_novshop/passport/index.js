const passport = require('passport');
const local = require('./localStrategy');
// const kakao = require('./kakaoStrategy');
const { User } = require('../models');

module.exports = () => {        
    // [1] serializeUser는 req.session 객체에 어떤 데이터를 저장할지 선택
    passport.serializeUser((user, done) => {      
        console.log('serializeUser');  
        // done의 첫번째 인자는 에러 발생 시 사용함.
        // done의 두번째 인자는 성공시 넘길 개체. (사용자 정보를 모두 저장하면 세션 용량 커지기에 id만 저장)
        done(null, user.id);                                
    });
    
    // [2] deserializeUser는 매 요청 시 실행, passport.session() 미들웨어가 이 메서드 호출
    passport.deserializeUser((id, done) => {
        console.log('deserializeUser');
        // serializeUser에서 세션에 저장했던 아이디를 받아 데이터베이스에서 사용자 정보를 조회        
        User.findOne({ where: { id } })   
            // ▼ 조회한 정보를 req.user(user)에 저장하므로 req.user를 통해 로그인한 사용자 정보를 가져올수 있음.
            .then(user=>done(null, user))   
            .catch(err => done(err));
        
    });
    local(passport);      
    // kakao(passport);
};
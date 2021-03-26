const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const {User} = require('../models');

const router = express.Router();

// 로그인 (POST /api/auth/login)  
    // [2] 이 방법으로 잘됨 (실질적문제는 localStrategy에서 잘못한거지만..?)
    // 참고:: https://solve-programming.tistory.com/m/27
/*
router.post('/login', 
    passport.authenticate('local'), 
    (req, res) => {
        res.json("성공");
        console.log(req.isAuthenticated(), req.session.passport.user);
        return res.status(200).send();
    }
);
*/

router.post('/login', (req, res, next) => {    
    const {userid, userpwd} = req.body;    
    console.log(userid, userpwd);

    passport.authenticate('local')    
    res.status(400).send();
});


/*  // 이거 변환해서 만들어보기.
router.post('/login', (req, res, next) => {    
    const {userid, userpwd} = req.body;    
    console.log(userid, userpwd);

    passport.authenticate('local', (authError, user, info) => {
        console.log('test');
        console.log(userid, userpwd);
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            res.status(401);    // Unauthorized :: 없는 계정
            res.send(info.message, '없는 계정입니다.');
            return;
        }
    })
});
*/


// 회원가입 (POST /api/auth/register)  
router.post('/register', async (req, res, next) => {
    const { userid, userpwd, usernick } = req.body;    

    try {
        const exUser = await User.findOne( {where: {userid}} );
        
        if (exUser) {
            // 이미 있는 계정   // 409 : Conflict  
            return res.status(409).send('이미 가입된 아이디 입니다.');            
        }

        const hash = await bcrypt.hash(userpwd, 12);
        /*
            - bcrypt.hash의 두번째인자:
                pbkdf2의 반복횟수와 비슷한 기능.
                숫자가 커질수록 비밀번호를 알아내기 어려워지며 암호화 시간도 오래걸림.
                ** 12이상을 추천
        */
        await User.create({
            userid,
            userpwd: hash,
            usernick,
        });
        return res.status(200).send(userid + ' 가입 완료');                
        
    } catch (error) {
        console.log('err');
        console.error(error);
        next(error);
        return;
    }
}); 

// 로그인 체크 (GET /api/auth/logincheck)  
router.get('/logincheck', (req, res, next) => {
    const {user} = req.session;

    if (!user) {
        // 로그인 중 아님   // 401 : Unauthorized
        return res.status(401).send('로그인이 되어있지 않습니다.');           
    }
    return user;

    /*
    if (req.isAuthenticated()) {    
        next();
        // return true;
    } else {
        res.status(401);    // Unauthorized
        res.send('로그인이 되어있지 않습니다.');
        // return false;
    }
    */
});



module.exports = router;
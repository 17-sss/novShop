const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { User } = require('../models');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'userid',
        passwordField: 'userpwd',        
    }, async (userid, userpwd, done) => {
        try {
            // (ME ▼) 제발... async/await 조심좀하자.. await안써서 값 제대로 못가져왔었어
            const exUser = await User.findOne({where: {userid}});   

            if (exUser) {                
                // 첫번째 인자와 두번째 인자 (hash(해싱된 코드))를 비교하여 같으면 true 아니면 false를 반환
                    // https://jungwoon.github.io/node.js/2017/08/07/bcrypt-nodejs/ 참고                
                const result = await bcrypt.compare(userpwd, exUser.userpwd);

                if (result) {                    
                    done(null, exUser);
                } else {
                    done(null, false, {message: '비밀번호가 일치하지 않습니다.'});
                }
            } else {
                done(null, false, {message: '가입되지 않은 회원입니다.'});
            }

        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};
import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { User } from '../models';

const router = express.Router();

// 로그인 (POST /api/auth/login)
router.post('/login',     
    passport.authenticate('local'), 
    (req, res) => {     
        const {user} = req;
        
        if (!user) {            
            // 여기는 거의 작동안함.
            // passport에서 인증 안되면 못넘어와서.. 
                // 음.. 여기로 넘어오게하는 방법은 추후 연구.
            return res.status(401).json({
                    error: 'Unauthorized',
                    code: -1,
                    message: '인증되지 않은 사용자',
            })
        } else {            
            req.logout();   // !! 추후제거
            return res.status(200).json({
                error: null,
                success: true,            
            })
        };
        // req.session.passport.user에는 id 값 있음. (passport.serializeUser에서 설정한 값)
    }
);

// 회원가입 (POST /api/auth/register)
router.post('/register', async (req, res /* next */) => {
    const { userid, userpwd, usernick } = req.body;

    try {
        const exUser = await User.findOne({ where: { userid } });

        if (exUser) {
            // 이미 있는 계정   // 409 : Conflict
            // return res.status(409).send('이미 가입된 아이디 입니다.');
            return res.status(409).json({
                error: 'USERID EXISTS',
                code: 1,
                message: '이미 가입된 아이디 입니다.',
            });
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
        
        return res.status(200).json({
            error: null,
            success: true,
        });

    } catch (error) {        
        console.error(error);
        // next(error);
        return res.status(500).json({
            error: 'UNKNOWN ERROR',
            code: -1,
            message: '서버 에러 (UNKNOWN ERROR)',
        });
    }
});

export default router;

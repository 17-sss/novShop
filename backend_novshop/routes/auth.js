// AUTH ******************************************************
import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { User } from '../models';

const router = express.Router();

// 로그인 (POST /api/auth/login)
router.post('/login',        
    passport.authenticate('local'), 
    (req, res) => {             
        /*
            굳이 아이디 정보를 확인할 필요 없음.
            Passport에서 성공하면, req객체에 user를 저장함. (req.user)
            반대로 실패하면 Passport에서 res.status(401) 반환
        */
        return res.status(200).json({
            error: null,
            success: true,            
        })        

        // req.session.passport.user에는 id 값 있음. (passport.serializeUser에서 설정한 값)
    }
);

// 회원가입 (POST /api/auth/register)
router.post('/register', async (req, res /* next */) => {
    const { userid, userpwd, username, address, phonenumber, email } = req.body;

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
            username,
            address, 
            phonenumber, 
            email
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
            message: '서버에 오류가 있습니다.',
        });
    }
});


// 유저(로그인) 체크 (GET /api/auth/usercheck)
router.get('/usercheck', (req, res /* next */) => {   
    if (req.isAuthenticated()) {
        const {user} = req;

        if (!user) {
            return res.status(401).json({ // Unauthorized
                error: 'SESSION OK, BUT USER UNDIFINED',
                code: -2,
                message: '세션엔 등록되어있지만, 유저 정보가 유효하지 않습니다.',
            })        
        } else {
            return res.status(200).json({
                error: null,
                success: true,
                data: user, 
            });
        }

    } else {
        res.status(401).json({
            error: 'SESSION UNDIFINED',
            code: -1,
            message: '세션에 등록되어 있지 않습니다.',
        })    
    }
});


// 로그아웃 (POST /api/auth/logout)
router.post('/logout', (req, res) => { 
    if (req.isAuthenticated()) {
        req.logout();
        req.session.destroy();
        
        return res.status(200).json({
            error: null,
            success: true,
        });
    } else {
        res.status(401).json({
            error: 'SESSION UNDIFINED',
            code: -1,
            message: '세션에 등록되어 있지 않습니다. 로그인이 되어있지 않습니다.',
        })    
    }
});

// 유저 정보 가져옴 (회원정보 수정 전) (POST /api/auth/getUserInfo)
router.post('/getUserInfo', async (req, res) => { 
    const {id} = req.body;
    try {
        const findUser = await User.findOne({ 
            where: { id },
            attributes: { 
                // 제외될 필드 목록 (exclude옵션 안쓰고 그냥 쓰면 보여질 필드 목록.)
                exclude: ['createdAt', 'deletedAt', 'updatedAt', 'userpwd'] 
            },
        });

        return res.status(200).json({
            data: findUser,
            error: null,
            success: true,
        });

    } catch (error) {
        console.error(error);        
        return res.status(500).json({
            error,
            code: -1,
            message: '서버에 오류가 있습니다.',
        });
    }
});

// 유저 정보 수정 (POST /api/auth/updUserInfo)
router.patch('/updUserInfo', async (req, res) => { 
    const { id, userid, userpwd, username, address, phonenumber, email } = req.body;    
    
    try {
        const backUser = await User.findOne({ where: { id } });
        const hash = await bcrypt.hash(userpwd, 12);

        await User.update(
            {
                userid,
                userpwd: userpwd ? hash : backUser.userpwd,
                username,
                address,
                phonenumber,
                email,
            },
            {
                where: { id },
            },
        );
        
        return res.status(200).json({
            error: null,
            success: true,
        });

    } catch (error) {
        console.error(error);        
        return res.status(500).json({
            error,
            code: -1,
            message: '서버에 오류가 있습니다.',
        });
    }
});


export default router;

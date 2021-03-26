// notice ******************************************************
import express from 'express';
import { Notice, sequelize, Sequelize } from '../models';

const router = express.Router();

// notice 생성 (POST /api/notice/create)
router.post('/create', async (req, res) => {
    const { userId, subject, content, } = req.body;
    
    try {
        const createNotice = await Notice.create({
            userId,
            subject,
            content,            
        });

        return res.status(200).json({
            error: null,
            success: true,
            data: createNotice,
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

// notice 불러옴
router.post('/getnotice', async (req, res) => {
    const {id} = req.body;
    
    try {
        // RAW QUERY
        let query = `            
            SELECT @ROWNUM := @ROWNUM + 1 AS RN, 
            notice.id, notice.subject, notice.content, notice.view, notice.createdAt, notice.updatedAt, notice.deletedAt,
            user.userid AS userDisplayId 
            FROM notices AS notice  
            LEFT OUTER JOIN users AS user ON notice.userId = user.id AND (user.deletedAt IS NULL),
            (SELECT @ROWNUM := 0) TMP
        `;

        if (!id) {
            query = query + `WHERE (notice.deletedAt IS NULL) ORDER BY RN DESC;`
        } else {
            query = query + `WHERE (notice.deletedAt IS NULL AND notice.id = :id ) ORDER BY RN DESC;`            
        }

        const getNotice = await sequelize.query(query, {
            replacements:  {id: id && id},
            type: Sequelize.QueryTypes.SELECT,
            raw: true,
        });

        return res.status(200).json({
            error: null,
            success: true,
            data: getNotice,
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

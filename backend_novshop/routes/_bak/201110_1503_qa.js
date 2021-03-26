// qa ******************************************************
import express from "express";
import {QA, User} from "../models";

const router = express.Router();

// Q&A 생성 (POST /api/qa/create)
router.post('/create', async(req, res) => {
    const { userId, productId, subject, content, picture } = req.body;

    try {
        const createQA = await QA.create({
            userId, productId, subject, content, picture
        });

        return res.status(200).json({
            error: null,
            success: true,
            data: createQA,
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


// 상품 Q&A 가져오기 (POST /api/qa/getProductQA)
router.post("/getProductQA", async(req, res) => {
    const {productId} = req.body;

    try {
        const getProductQA = await QA.findAll({
            include: [  // JOIN 함, 연관된 테이블만 넣을 수 있는 듯! (관계 지정해놓은 테이블들.)
                {                    
                    model: User,
                    attributes: ['userid'],
                },
            ],
            order: [
                ['id', 'DESC'],
            ],
            where: {
                productId,
            },
            logging: function (query) {
                console.log(
                    '=============================================\n',
                    'getProductQA\n',
                    '=============================================\n',
                    query,
                    '\n =============================================||',
                );
            },
        });        
                
        return res.status(200).json({
            error: null,
            success: true,
            data: getProductQA,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error,
            code: -1,
            message: "서버에 오류가 있습니다.",
        });
    }
});

export default router;
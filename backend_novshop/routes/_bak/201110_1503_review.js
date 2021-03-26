// REVIEW ******************************************************
import express from "express";
import {Review, User} from "../models";

const router = express.Router();

// 리뷰 생성 (POST /api/review/create)
router.post('/create', async(req, res) => {
    const { userId, productId, subject, content, picture, rate } = req.body;

    try {
        const createReview = await Review.create({
            userId, productId, subject, content, picture, rate
        });

        return res.status(200).json({
            error: null,
            success: true,
            data: createReview,
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


// 특정 상품 리뷰 가져오기 (POST /api/review/getProductReview)
router.post("/getProductReview", async(req, res) => {
    const {productId} = req.body;
    try {
        const getProductReview = await Review.findAll({
            include: [  
                {                    
                    model: User,
                    attributes: ['userid'],
                },
            ],
            where: {
                productId,
            },
            logging: function (query) {
                console.log(
                    '=============================================\n',
                    'getProductReview\n',
                    '=============================================\n',
                    query,
                    '\n =============================================||',
                );
            },            
        });   

        return res.status(200).json({
            error: null,
            success: true,
            data: getProductReview,
        })
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
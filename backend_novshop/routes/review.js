// REVIEW ******************************************************
import express from "express";
import {Review, sequelize, Sequelize} from "../models";

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
        // RAW QUERY VER, 일반은 백업본 참고 (201110_1503_review)
        const query = `            
            SELECT @ROWNUM := @ROWNUM + 1 AS RN, 
            review.id, review.subject, review.content, review.picture, review.rate, review.createdAt, 
            review.updatedAt, review.deletedAt, review.userId, review.productId, 
            user.userid AS userDisplayId 
            FROM reviews AS review 
            LEFT OUTER JOIN users AS user ON review.userId = user.id AND (user.deletedAt IS NULL),
            (SELECT @ROWNUM := 0) TMP
            WHERE (review.deletedAt IS NULL AND review.productId = :productId) ORDER BY RN DESC;
        `;

        const getProductReview = await sequelize.query(query, {
            replacements: { productId },
            type: Sequelize.QueryTypes.SELECT,
            raw: true,
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
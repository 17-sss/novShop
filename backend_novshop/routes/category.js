// CATEGORY ******************************************************
import express from "express";
import {Category} from "../models";

const router = express.Router();

// 카테고리 생성 (POST /api/category/create)
router.post('/create', async (req, res) => {
    const { key, displayValue, items } = req.body;

    try {
        const exCategory = await Category.findOne({ where: { key } });

        if (exCategory) {
            res.statusMessage = 'CATEGORY EXISTS';
            
            return res.status(450).json({
                error: 'CATEGORY EXISTS',
                code: 1,
                message: '이미 존재하는 카테고리입니다.',
            });
        }

        const createData = await Category.create({
            key,
            displayValue,
            items: JSON.stringify(items),            
        });

        return res.status(200).json({
            error: null,
            success: true,
            data: {
                key: createData.key,
                displayValue: createData.displayValue,
                items: createData.items,
            },
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


// 카테고리 전부 가져오기 (POST /api/category/getall)
router.post('/getall', async(req, res) => {
    try {   
        const allCategory = await Category.findAll();

        if (!allCategory) {
            res.statusMessage = "CATEGORY IS NULL";

            return res.status(451).json({
                error: 'CATEGORY IS NULL',
                code: 1,
                message: '카테고리 목록을 불러올 수 없습니다.',
            });
        }

        return res.status(200).json({
            error: null,
            success: true,
            data: allCategory, 
        });

    } catch (error) {
        console.error(error);   // error.response 라는 속성있는지 체크해보기. 
            // 있다면 아래 error코드도 자유자재..가능?
        return res.status(500).json({
            error,
            code: -1,
            message: '서버에 오류가 있습니다.',
        });
    }
});


export default router;
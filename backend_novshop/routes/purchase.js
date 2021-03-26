// 장바구니(ShoopingCart), 구매(Buy) 모델 쓰임
import { create } from "domain";
import express from "express";
import { ShoppingCart, Product, Buy, User } from "../models";
import user from "../models/user";

const router = express.Router();

// 장바구니 담기 (POST /api/purchase/cartIn)
router.post("/cartIn", async(req, res) => {
    const {        
        volume, selcolor, selsize, productId, userId
    } = req.body;
    
    if (!userId || !productId) {                
        return res.status(460).json({
            error: 'USERID OR PRODUCTID IS NULL',
            code: 1,
            message: !userId
                ? '유저 정보가 존재하지 않습니다.'
                : !productId
                ? '상품 정보가 존재하지 않습니다.'
                : !productId && !userId && '유저, 상품 정보가 존재하지 않습니다.',
        });
    }

    try {
        const duplicateCheck = await ShoppingCart.findOne({
            where: {selcolor, selsize, productId, userId,}
        });

        if (duplicateCheck) {
            // 중복O: 수량만 변경
            const { volume: currentVol, id } = duplicateCheck;

            const updateVolCart = await ShoppingCart.update(
                { volume: Number(currentVol + volume) },
                { where: { id } },
            );

            return res.status(200).json({
                error: null,
                success: true,
                data: updateVolCart,
            });
        } else {
            // 중복X: 장바구니에 담음
            const createCart = await ShoppingCart.create({
                volume,
                selcolor,
                selsize,      
                productId,
                userId,      
            });

            return res.status(200).json({
                error: null,
                success: true,
                data: createCart,
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error,
            code: -1,
            message: '서버에 오류가 있습니다.',
        });
    }
});


// 장바구니 수량 업데이트 (PATCH /api/purchase/updCartVolume)
router.patch("/updCartVolume", async(req, res) => { 
    const {id, volume} = req.body;

    try {
        const updCartVolume = await ShoppingCart.update({volume}, { where: { id } });
        
        return res.status(200).json({
            error: null,
            success: true,      
            data: updCartVolume,
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

// 장바구니 (유저에 따른) 정보 가져오기  (POST /api/purchase/getCart)
router.post("/getCart", async(req, res) => {
    const { userId } = req.body;
    try {
        const getCart = await ShoppingCart.findAll({
            where: { userId },      
            attributes: { 
                // 제외될 필드 목록 (exclude옵션 안쓰고 그냥 쓰면 보여질 필드 목록.)
                exclude: ['createdAt', 'deletedAt', 'updatedAt'] 
            },      
            // JOIN (Product 테이블)
            include: [  
                {                    
                    model: Product,
                    attributes: ['name', 'image', 'sizes', 'price', 'sale', 'mileage', 'categoryId', 'categorySub'],
                },
            ],
        });

        return res.status(200).json({
            error: null,
            success: true,
            data: getCart,
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

// 선택 상품 삭제, 장바구니 비우기   (POST /api/purchase/delCartGoods)
router.post("/delCartGoods", async (req, res) => {
    const { items } = req.body;
    
    if (items.length <= 0) {
        return res.status(455).json({
            error,
            code: -2,
            message: '제거할 상품이 없습니다. 서버 오류일 수 있습니다.',
        });
    };

    let isErr = null;

    for (let i = 0; i < items.length; i++) {
        const id = Number(items[i]);
        console.log(id);
        if (typeof id !== "number") continue;

        try {
            await ShoppingCart.destroy({where: { id }});            
        } catch(error) {
            isErr = error;
            break;
        }
    }

    if (isErr) {
        return res.status(500).json({
            isErr,
            code: -1,
            message: '서버에 오류가 있습니다.',
        });
    } else {
        return res.status(200).json({
            error: null,
            success: true,            
        });
    }
});

// 구매 확정 및 유저 마일리지+  (Buy Table에 In)  (POST /api/purchase/buyIn)
router.post('/buyIn', async (req, res) => {
    const {
        orderInfo,
        receiveInfo,
        items,
        allProductPrice,
        shippingFee,
        totalPrice,
        userId,
    } = req.body;

    try {
        const getUser = await User.findOne({
            where: { id: userId } 
        });
        const { mileage } = getUser;
        const curMileage = Number(allProductPrice.replace(",", "")) * 0.01;

        await User.update(
            { mileage: Number(mileage + curMileage) },
            { where: { id: userId } },
        );

        const date = new Date();
        const orderDate =
            '' +
            date.getFullYear() +
            (date.getMonth() + 1) +
            date.getDate() +
            date.getHours() +
            date.getMinutes() +
            date.getSeconds() +
            date.getMilliseconds();

        await Buy.create({
            orderNumStr: `${orderDate}_${userId}`,
            orderInfo: JSON.stringify(orderInfo),
            receiveInfo: JSON.stringify(receiveInfo),
            items: JSON.stringify(items),
            allProductPrice,
            shippingFee,
            totalPrice,
            userId,
        });
        
        return res.status(200).json({
            data: "buyInOK",
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

// 구매 확정 후 마지막 데이터 GET (POST /api/purchase/getBuyConfirm)
router.post('/getBuyConfirm', async(req, res) => {
    const { userId } = req.body;
    
    try {
        const getBuyConfirm = await Buy.findOne({
            where: { userId },
            order: [
                ['createdAt', 'DESC'],
            ],  
            offset: 0,
        });

        return res.status(200).json({
            data: getBuyConfirm,
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

// 마이페이지에서 구매 횟수 및 총금액 계산
router.post('/getBuyListPrice', async(req, res) => {
    const { userId } = req.body;
        
    try {
        const getBuyList = await Buy.findAndCountAll({
            where: { userId }            
        });
        const getBuyAllSum = await Buy.sum('allProductPrice', { where: { userId }  });

        return res.status(200).json({
            data: {...getBuyList, sum: getBuyAllSum},
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
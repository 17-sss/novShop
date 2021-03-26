// PRODUCT ******************************************************
import { Router } from 'express';
import { Product } from '../models';
import upload from '../module/upload';

// function: mileage 계산용 
const calcMileage = (price, sale) =>
    (sale > 0 && sale < 1)
        ? Number(Math.round((price - price * sale) * 0.01))
        : Number(Math.round(price * 0.01));
// -----/

const router = Router();                                    

// 상품 생성 (POST /api/product/create)
router.post('/create', upload.single('image'), async (req, res) => {
    const {
        name,
        // image,
        sizes,
        colors,
        price,
        sale,
        description,
        detailinfo,
        categorySub,
        categoryId,
    } = req.body;   // formData로 받아옴. 일부 JSON.stringify해서 옴

    const mileage = calcMileage(Number(price), Number(sale));

    if (!req.file) {
        res.statusMessage = 'IMAGE UPLOAD ERROR';
        return res.status(512).json({
            error: 'req.file: ' + req.file,
            bodyStatus: req.body,
            code: -2,
            message: '이미지 파일 업로드 오류',
        });
    }

    try {
        const createData = await Product.create({
            name,
            image: req.file.filename,
            sizes,
            colors,
            price,
            sale,
            mileage,
            description,
            detailinfo,
            categorySub,
            categoryId,
        });

        return res.status(200).json({
            error: null,
            success: true,
            data: {
                ...createData,
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

// 상품 목록 전부 불러오기 (GET /api/product/getAll)
router.get('/getAll', async (req, res) => {
    const {categoryId, categorySub} = req.query;

    try {
        let where = {};

        if (categoryId) {
            if (categorySub) {
                where = {
                    ...where,
                    categoryId,
                    categorySub,
                }
            } else {
                where = {
                    ...where,
                    categoryId,                    
                } 
            }            
        };
                
        const allProduct = await Product.findAll({where: where});

        if (!allProduct) {
            res.statusMessage = 'PRODUCT_LIST IS NULL.';

            return res.status(452).json({
                error: 'PRODUCT_LIST IS NULL.',
                code: 1,
                message: '상품 전체 목록을 불러올 수 없습니다.',
            });
        }

        return res.status(200).json({
            error: null,
            success: true,
            data: allProduct,
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

// 상품 불러오기 (GET /api/product/get)
router.get('/get', async (req, res) => {
    const { id, categorySub, categoryId } = req.query; // (쿼리스트링의 값. products db 기반)
    let errMsg = '';

    if (!id) {
        errMsg = 'PRODUCT_ID IS NULL'
        res.statusMessage = errMsg;

        return res.status(453).json({
            error: errMsg,
            code: 1,
            message: '상품의 ID가 없어 정보 불러올 수 없습니다.',
        });
    }

    try {
        let where = {id: id};    

        if (categoryId) {
            if (categorySub)
                where = {...where, categoryId: categoryId, categorySub: categorySub}
            else 
                where = {...where, categoryId: categoryId}
        } else {            
            if (categorySub) {
                errMsg  ='Unable to search with key (categorySub)';
                res.statusMessage = errMsg;

                return res.status(453).json({
                    error: errMsg,
                    code: 2,
                    message: '상품의 categorySub만 가지고 값을 검색할 순 없습니다.',
                })
            }
        }        

        const product = await Product.findOne({
            where: where,
            attributes: {
                // exclude는 제외할 필드 설정. exclude 안쓰고 그냥 딱! 배열만 놓을땐 표시할 필드 설정
                exclude: ['createdAt', 'deletedAt', 'updatedAt', /*'id'*/],
            },
        });

        if (!product) {
            errMsg = 'PRODUCT IS NULL';
            res.statusMessage = errMsg;

            return res.status(453).json({
                error: errMsg,
                code: 3,
                message: '상품 정보 불러올 수 없습니다.',
            });
        }

        return res.status(200).json({
            error: null,
            success: true,
            data: product,
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

// 상품 가져오기 for Admin (GET /api/product/adminGet)
router.get("/adminGet", async(req, res) => {
    const { id } = req.query;
    
    try {
        const getAdminProduct = await Product.findOne({ where: {id} });
    
        return res.status(200).json({
            error: null,
            success: true,       
            data: getAdminProduct,     
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

// 상품 수정 for Admin (PATCH /api/product/adminUpd)
router.patch("/adminUpd", upload.single('image'), async(req, res) => {
    const {
        name,
        // image,
        sizes,
        colors,
        price,
        sale,
        description,
        detailinfo,
        categorySub,
        categoryId,
        id,
    } = req.body;   // formData로 받아옴.

    const mileage = calcMileage(Number(price), Number(sale));

    try {
        let updateFields = {};
        if (req.file && req.file.filename) {
            updateFields = {
                name,
                image: req.file.filename,
                sizes,
                colors,
                price,
                sale,
                mileage,
                description,
                detailinfo,
                categorySub,
                categoryId,
            }
        } else {
            updateFields = {
                name,                
                sizes,
                colors,
                price,
                sale,
                mileage,
                description,
                detailinfo,
                categorySub,
                categoryId,
            }
        }

        const updateAdminProduct = await Product.update(updateFields, { where: { id } });

        return res.status(200).json({
            error: null,
            success: true,      
            data: updateAdminProduct,
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


// 상품 삭제 for Admin (POST /api/product/adminDel)
router.post("/adminDel", async (req, res) => {
    const { id } = req.body;
    console.log(id);
    try {
        await Product.destroy({ where: {id} });
    
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
})

export default router;

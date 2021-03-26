// UPLOAD ******************************************************
import { Router } from 'express';
import upload from '../module/upload';

const router = Router();

// 이미지 업로드 :: write(quill에디터)폼에서 쓰임   (POST /api/upload/imgone)
router.post("/imgone", upload.single('image'), async (req, res) => {        
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
        return res.status(200).json({
            error: null,
            success: true,
            data: req.file.filename,
        });
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            error,
            code: -1,
            message: '서버에 오류가 있습니다.',
        });
    }
});

export default router;
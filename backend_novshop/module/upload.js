import multer from 'multer';
import fs from 'fs';
import path from 'path';

// 1) 폴더 생성
fs.readdir('../frontend_novshop/public/uploads', (err) => {
    // fs.readdir('uploads', (err) => {     //  bak, 백앤드기반 디렉토리
    if (err) {
        console.error('uploads 폴더가 없습니다. 폴더를 생성합니다.');
        fs.mkdirSync('../frontend_novshop/public/uploads');
    }
});

// 2) multer 설정 (로컬)
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            // cb는 callback이란 뜻
            cb(null, '../frontend_novshop/public/uploads/');
            // cb(null, 'uploads/');    //  bak, 백앤드기반 디렉토리
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(
                null,
                path.basename(file.originalname, ext) +
                    new Date().valueOf() +
                    ext,
            );
        },
    }),
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});

export default upload;

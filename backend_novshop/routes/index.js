// INDEX (루트 라우터) ******************************************************
import express from "express";
import category from "./category";
import auth from "./auth";
import product from "./product";
import review from "./review";
import qa from "./qa";
import notice from "./notice";
import purchase from "./purchase";
import upload from "./upload";

const router = express.Router();
router.use('/auth', auth);
router.use('/category', category);
router.use('/product', product);
router.use('/review', review);
router.use('/qa', qa);
router.use('/notice', notice);
router.use('/purchase', purchase);

router.use('/upload', upload);  // 이미지 업로드 컨트롤

export default router;
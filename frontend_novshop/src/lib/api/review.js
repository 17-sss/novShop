import client from './client';

// 리뷰 생성
export const createReview = ({userId, productId, subject, content, picture, rate}) => {        
    return client.post('/api/review/create', {userId, productId, subject, content, picture, rate});
};

// [ROWNUM 활용] 상품 리뷰 가져오기
export const getProductReview = ({productId}) => {        
    return client.post('/api/review/getProductReview', {productId});
};
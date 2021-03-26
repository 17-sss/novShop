import client from './client';

// QA 생성
export const createQA = ({ subject, content, userId, productId }) => {        
    return client.post('/api/qa/create', { subject, content, userId, productId });
};

// QA 가져오기 (id 기준)
export const getQA = ({id}) => {
    return client.post('/api/qa/getQA', {id});
}

// [ROWNUM 활용] 상품 QA 가져오기 or 전부 가져오기 
export const getProductQA = ({productId}) => {        
    return client.post('/api/qa/getProductQA', {productId});
};
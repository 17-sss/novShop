import client from './client';

// 공지 생성
export const createNotice = ({ subject, content, userId }) => {        
    return client.post('/api/notice/create', { subject, content, userId });
};

// 특정 공지 가져오기
export const getNotice = ({id}) => {    
    return client.post('/api/notice/getNotice', {id});
};

// [ROWNUM 활용] 공지 전부 가져오기
export const getAllNotice = () => {    
    return client.post('/api/notice/getAll');
};


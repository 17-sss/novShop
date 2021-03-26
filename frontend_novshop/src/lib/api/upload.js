import client from './client';

// 이미지 하나만 업로드
export const imageUpload = ({imgData}) => {         
    const formData = new FormData();
    formData.append('image', imgData);

    return client.post('/api/upload/imgone', formData);
};
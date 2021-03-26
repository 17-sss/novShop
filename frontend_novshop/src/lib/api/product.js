import client from './client';

export const createProduct = ({
    name,
    image,
    sizes,
    colors,
    price,
    sale,
    description,
    detailinfo,
    categorySub,
    categoryId,
}) => {    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);
    formData.append('sizes', JSON.stringify(sizes));
    formData.append('colors', JSON.stringify(colors));
    formData.append('price', price);
    formData.append('sale', sale);
    formData.append('description', description);
    formData.append('detailinfo', detailinfo);
    formData.append('categorySub', categorySub);
    formData.append('categoryId', categoryId);
    
    return client.post('/api/product/create', formData);
};

export const getAllProduct = ({categoryId, categorySub}) => {
    return client.get('/api/product/getall', {
        params:{
            categoryId,         // main
            categorySub,        // sub       
        }
    });
}

export const getProduct = ({ categoryId, categorySub, id })  => {        
    return client.get('/api/product/get', {
        params: {           // 쿼리스트링 전달  
            // ------- 실제 url에선  ▼
            categoryId,         // main
            categorySub,        // sub
            id,                 // itemId
            // ----------------------
        }
    });  
};

export const adminGetProduct = ({ id })  => {        
    return client.get('/api/product/adminGet', {
        params: {
            id,
        }
    });
};

export const adminUpdProduct = ({     
    name,
    image,
    sizes,
    colors,
    price,
    sale,
    description,
    detailinfo,
    categorySub,
    categoryId, 
    id,
})  => {        
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);    // Update의 이미지 변경여부는 서버에서 확인.
    formData.append('sizes', JSON.stringify(sizes));
    formData.append('colors', JSON.stringify(colors));
    formData.append('price', price);
    formData.append('sale', sale);
    formData.append('description', description);
    formData.append('detailinfo', detailinfo);
    formData.append('categorySub', categorySub);
    formData.append('categoryId', categoryId);
    formData.append('id', id);
    
    return client.patch('/api/product/adminUpd', formData);
};

export const adminDelProduct = ({ id })  => {        
    return client.post('/api/product/adminDel', { id });
};
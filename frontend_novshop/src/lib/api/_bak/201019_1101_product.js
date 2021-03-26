import client from './client';

export const createProduct = ({
    name,
    image,
    sizes,
    colors,
    price,
    sale,
    description,
    categorySub,
    categoryId,
}) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);
    formData.append('sizes', sizes);
    formData.append('colors', colors);
    formData.append('price', price);
    formData.append('sale', sale);
    formData.append('description', description);
    formData.append('categorySub', categorySub);
    formData.append('categoryId', categoryId);

    return client.post('/api/product/create', formData);
    /* 
    return fetch ( "/api/product/create",  { 
        method : "POST" , 
        body : formData 
    });
    */
    /*  
    return axios
        .post('/api/product/create', formData)
        .then((res) => {
            alert('성공');
        })
        .catch((err) => {
            alert('실패');
        });
    */
    /*
    return axios({
        method: 'post',
        url: '/api/product/create',
        data: formData,
        headers: {
            'content-type': 'multipart/form-data',
        },
    });    
    */
};

// bak 201017_2250
/*
export const createProduct = ({
    name,
    image,
    sizes,
    colors,
    price,
    sale,
    description,
    categorySub,
    categoryId,
}) => {
    return client.post('/api/product/create', {
        name,
        image,
        sizes,
        colors,
        price,
        sale,
        description,
        categorySub,
        categoryId,
    });
};
*/

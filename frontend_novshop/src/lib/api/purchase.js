import client from './client';

export const cartIn = ({ volume, selcolor, selsize, productId, userId }) => {
    return client.post('/api/purchase/cartIn', {
        volume,
        selcolor,
        selsize,
        productId,
        userId,
    });
};

export const getCart = ({ userId }) => {
    return client.post('/api/purchase/getCart', { userId });
};

export const updCartVolume = ({ id, volume }) => {
    return client.patch('/api/purchase/updCartVolume', { id, volume });
};

export const delCartGoods = ({ items }) => {
    return client.post('/api/purchase/delCartGoods', { items });
};

export const buyIn = ({ orderInfo, receiveInfo, items, allProductPrice, shippingFee, totalPrice, userId }) => {
    return client.post('/api/purchase/buyIn', { orderInfo, receiveInfo, items, allProductPrice, shippingFee, totalPrice, userId });
};

export const getBuyConfirm = ({ userId }) => {
    return client.post('/api/purchase/getBuyConfirm', { userId });
};

export const getBuyListPrice = ({ userId }) => {
    return client.post('/api/purchase/getBuyListPrice', { userId });
};
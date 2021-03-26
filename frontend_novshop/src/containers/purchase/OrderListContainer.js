import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OrderListTemplate from '../../components/purchase/OrderListTemplate';
import { getBuyListPrice, initialPurchase } from '../../modules/purchase';

const OrderListContainer = () => {
    const dispatch = useDispatch();
    const { userData, buy } = useSelector(({ user, purchase }) => {
        return {
            userData: user.user,
            buy: purchase.buy,
        };
    });
    const [orderItems, setOrderItems] = useState(null);

    useEffect(() => {
        setOrderItems(null);
        dispatch(initialPurchase());

        if (userData && userData.data && userData.data.id)
            dispatch(getBuyListPrice({ userId: userData.data.id }));
    }, [dispatch, userData]);

    useEffect(() => {
        if (buy && buy.data && buy.data.rows) {
            const tempRows = [];
            buy.data.rows.map((v) =>
                tempRows.push({
                    ...v,
                    createdAt: new Date(v.createdAt),
                    items: JSON.parse(v.items),             // 주문상품들
                    orderInfo: JSON.parse(v.orderInfo),     // 주문자
                    receiveInfo: JSON.parse(v.receiveInfo), // 받는사람
                }),
            );
            setOrderItems(tempRows);            
        }
    }, [buy]);

    // *** 기타 ***
    // 1) 주문 정보
    const headDatas = [
        { name: '주문일자', width: '8%' },
        { name: '이미지', width: '20%' },
        { name: '상품정보', width: '52%' },        
        { name: '총 구매금액', width: '14%' },
    ];
    
    // 2) 주문 상세정보 -> OrderListDetailTable의 "주문 상품 정보"
    const orderProdHeadDatas = [
        // 배송구분, 주문처리상태, 취소/교환/반품 는 나중에..
        { name: '이미지', width: '13%' },
        { name: '상품정보', width: '60%' },
        { name: '수량', width: '13%' },        
        { name: '판매가', width: '13%' },
    ];

    return <OrderListTemplate orderItems={orderItems && orderItems} etc={{ headDatas, orderProdHeadDatas }} />;
};

export default OrderListContainer;

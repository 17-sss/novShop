import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { initialPurchaseForm, getBuyConfirm } from "../../modules/purchase";
import BuyConfirmTemplate from '../../components/purchase/BuyConfirmTemplate';
import { threeDigitsComma } from "../../lib/utility/customFunc";

const BuyConfirmContainer = (props) => {
    const { history } = props;

    const dispatch = useDispatch();
    const { buy, userData } = useSelector(({ purchase, user }) => ({
        buy: purchase.buy,
        userData: user.user,
    }));

    const [data, setData] = useState(null);

    const colInfo = {
        value: ['이미지', '상품정보', '판매가', '수량', '적립금', '합계'],
        width: ['20', '40', '10', '10', '10', '10', '10'],
    };

    useEffect(() => {
        dispatch(initialPurchaseForm({form: "buy"}));
    }, [dispatch]);

    useEffect(() => {        
        if (!userData || typeof userData === "string" || !userData.data) return;
        
        const { id } = userData.data;
        if (id > 0) { 
            dispatch(getBuyConfirm({userId: id}));
        }
    }, [dispatch, userData]);

    useEffect(() => {
        if (!buy || !buy.data) return;
        const {orderInfo, receiveInfo, items, allProductPrice, shippingFee, totalPrice } = buy.data;
        setData({
            orderInfo: JSON.parse(orderInfo),
            receiveInfo: JSON.parse(receiveInfo),
            items: JSON.parse(items),
            allProductPrice: threeDigitsComma(allProductPrice),
            shippingFee: shippingFee === 0 ? "무료" : threeDigitsComma(shippingFee),
            totalPrice: threeDigitsComma(totalPrice),
        });
    }, [buy]);

    const onMainGoClick = () => {
        history.push(`/`);
    };

    return (
        <BuyConfirmTemplate 
            data={data && data}
            etcs={{ colInfo, }}
            events={{ onMainGoClick, }}
        />
    );
};

export default withRouter(BuyConfirmContainer);
import React from 'react';
import BuyContainer from '../containers/purchase/BuyContainer';
import BuyConfirmContainer from '../containers/purchase/BuyConfirmContainer';
import CartContainer from '../containers/purchase/CartContainer';

const PurchasePage = (props) => {
    const {
        match: {
            params: { page },
        },
    } = props;
    return page === 'buy' ? (
        <BuyContainer />
    ) : page === 'shoppingcart' ? (
        <CartContainer />
    ) : (
        page === 'buyConfirm' && <BuyConfirmContainer />
    );
};

export default PurchasePage;

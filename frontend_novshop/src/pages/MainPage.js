import React from 'react';

import SwipeTemplate from '../components/swipe/SwipeTemplate';
import ProductContainer from '../containers/product/ProductContainer';

const MainPage = () => {
    return (
        <>
            <SwipeTemplate />
            <ProductContainer
            // Items = {TestItem()}
            />
        </>
    );
};

export default MainPage;
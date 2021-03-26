import React from 'react';
import queryString from 'query-string';
import ProductContainer from '../containers/product/ProductContainer';
import ProductDetailContainer from '../containers/product/ProductDetailContainer';

const ShoppingPage = (props) => {
    const { location /* match */ } = props;        
    const query = queryString.parse(location.search);   // 쿼리스트링 가져옴 (main, sub, itemId)  
    
    if (query) {
        const {main, itemId} = query;

        if (itemId) {
            // [1] 상품 상세 정보
            return <ProductDetailContainer query={query} />;
        } else {
            // [2] 상품 목록 페이지
            if (main) {
                // 1) main 값이 있으면 해당 대분류의 상품목록 페이지            (컨테이너에서 해결)
                // 2) sub 값도 있으면 해당 대분류, 소분류의 상품목록 페이지      (컨테이너에서 해결)
                return <ProductContainer query={query} /> 
            } else {
                // +) main 없으면 돌아가면 안댐.
                return <div>query is null</div>
            }
            
        }
    } else {
        return <div>query is null</div>
    }
    
};

export default ShoppingPage;

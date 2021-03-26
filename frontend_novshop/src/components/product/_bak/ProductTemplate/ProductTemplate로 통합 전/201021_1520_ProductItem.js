import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Col } from 'react-bootstrap';

import { getSize } from '../../../lib/utility/customFunc';
import { ClearEx, CustomLink } from '../../common/StyleUtilModels';
import { cssDisplayNone, cssStrike } from '../../common/StyleUtilCSS';

// ========================================================================================
// ************* Col(최상위) 틀 *************
// ========================================================================================
const StyledItem = styled(Col)`
    height: ${getSize(1.6, 'height')};
    /* border: 1px solid black; */
    padding: 15px;
`;
// ---------------------------------------------------/

// ========================================================================================
// ************* 상품이미지 Wrapper *************
// ========================================================================================
const ImageWrapper = styled.div`
    text-align: center;
    margin: 5px 0;
`;
// ---------------------------------------------------/

// ========================================================================================
// ************* 상품 Wrapper *************
// ========================================================================================
const ProductWrapper = styled.div`
    width: 100%;
`;
// ---------------------------------------------------/

// ========================================================================================
// ************* 상품 - 색상 Wrapper *************
// ========================================================================================
const ProductColorWrapper = styled.div`
    width: 100%;
    margin: 10px 0;
`;
// ---------------------------------------------------/

// ========================================================================================
// ************* 상품 - 색상 *************
// ========================================================================================
const ProductColor = styled.span`
    width: 20px;
    height: 4px;
    margin-right: 2px;
    float: left;
    box-sizing: border-box;
    border: 1px solid #e3e3e5;
    font-size: 0;
    line-height: 0;

    background-color: ${(props) =>
        props.color === undefined ? 'black' : props.color};
`;
// ---------------------------------------------------/

// ========================================================================================
// ************* 상품 - 상품명, 사이즈 *************
// ========================================================================================
const ProductNameLink = styled(CustomLink)`
    margin: 0;
    padding: 0;

    font-weight: bold;
    font-size: 13px;
    color: black;

    &:focus,
    &:hover,
    &:visited,
    &:link,
    &:active {
        color: black;
    }

    .sizeInfo {
        padding-left: 4px;
        font-size: 11px;
        color: #666666;
        font-weight: normal;
    }
`;
// ---------------------------------------------------/

// ========================================================================================
// ************* 상품 - 가격 & 부가설명 ul *************
// ========================================================================================
const ProductPriceUl = styled.ul`
    ${(props) => {
        switch (props.mode) {
            // mode 1 : 가격 관련
            case 1: {
                return css`
                    padding-bottom: 22px;
                    display: block;
                    height: 16px;
                    line-height: 16px;
                    font-size: 12px;
                    border-bottom: 1px solid #e6e6e6;
                `;
            }
            // mode 2: 부가설명
            case 2: {
                return css`
                    line-height: 1.5em;
                `;
            }

            default:
                break;
        }
    }}
`;
// ---------------------------------------------------/

// ========================================================================================
// ************* 상품 - 가격 & 부가설명 li *************
// ========================================================================================
const cssNormalPrice = css`
    display: inline-block;                        
    color: black;
    font-size: 10pt;
    padding-right: 10px;
`;

const ProductPriceLi = styled.li`
    /* 일반 가격 */
    &.price {
        ${(props) => {
            const {sale, price} = props;

            if (!sale) {
                if (price)  return cssNormalPrice; 
                else        return [cssDisplayNone, cssStrike];
            } else {
                if (price) {
                    return css`
                        ${cssNormalPrice};
                        color: #666666;
                        ${cssStrike};
                    `;
                } else {
                    return [cssDisplayNone, cssStrike]; 
                }                
            }
        }}
    }

    /* 세일 */
    &.sale {
        ${(props) => {
            const {sale} = props;

            if (!sale)  return [cssDisplayNone, cssStrike];
            else        return cssNormalPrice;            
        }}
    }

    /* 부가설명 */
    &.description {        
        ${(props) => {
            const {description} = props;

            if (!description) {
                return [cssDisplayNone, cssStrike]
            } else {
                return css`
                    text-align: left;
                    position: relative;
                    /* margin: 4px auto 0px; 상 - 좌우 - 하 */
                    margin: 0 auto;
                    color: #666666;                    
                    font-size: 11.5px;
                    line-height: 22px;  /* 이거쓰면 라인(글)이 밑으로 내려감, 굳이 마진 패딩안써도됨. */
                `;
            }
        }}

    }
`;
// ---------------------------------------------------/

// ----------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------

const ProductItem = (props) => {
    // ** useHooks **
    const [colHeight, setColHeight] = useState(0);
    const colRef = useRef(null);

    const [imgHeight, setImgHeight] = useState(0);
    const imgRef = useRef(null);
    const imgOnload = () => {
        return setImgHeight(imgRef.current.clientHeight);
    };

    useEffect(() => {
        setColHeight(colRef.current.clientHeight);
    }, [colHeight, imgHeight]);

    const imageTagHeight = () => {
        if (colHeight === 0 || imgHeight === 0) {
            return;
        }

        if (colHeight * 0.7 < imgHeight) return 'auto';
        else return colHeight * 0.7;
    };


    // ** props 변수화 **
    const {     
        itemImage,      // 이미지: 이미지가 있는 위치
        itemName,       // 상품명
        itemLink,       // 상품링크
        itemSize,       // 상품사이즈 정보
        itemColors,     // 상품컬러 정보
        price,          // 상품가격 - 일반가
        sale,           // 상품가격 - 세일가 
        description,        // 상품 부가설명
    } = props;


    // ** render **
    return (
        <StyledItem ref={colRef}>
            {/* 이미지 START */}
            <ImageWrapper>
                <CustomLink to = {itemLink}>
                    <img
                        ref={imgRef}
                        onLoad={imgOnload}
                        src={itemImage}
                        alt={itemName}
                        width="100%"
                        height={imageTagHeight()}
                    />
                </CustomLink>
            </ImageWrapper>
            {/* 이미지 END */}

            <ClearEx />

            {/* 상품 START */}
            <ProductWrapper>
                {/* 색상 */}
                <ProductColorWrapper>
                    {itemColors.map( (value, i) => {
                        return (
                            <ProductColor 
                                key = {i}
                                color = {value}
                            />
                        );
                    })}
                </ProductColorWrapper>

                <ClearEx style={{ padding: '2px 0' }} />

                {/* 상품명 & 사이즈 정보 */}
                <ProductNameLink to = {itemLink}>
                    {itemName}

                    <span className="sizeInfo">
                        {itemSize.map((value, i) => {                            
                            const thisLen = itemSize.length;
                            if (i === (thisLen-1)) {
                                return value + "]";    
                            } else if (i === 0) {
                                return "[" + value + ", ";
                            } else {
                                return value + ",";
                            }                                                            
                        })}
                    </span>
                </ProductNameLink>

                {/* 상품가격 */}
                <ProductPriceUl mode={1}>
                    {/* [1] 일반  */}
                    <ProductPriceLi className="price" price={price} sale={sale}>
                        {price}원
                    </ProductPriceLi>

                    {/* [2] 세일 */}
                    <ProductPriceLi className="sale" sale={sale}>
                        {sale}원
                    </ProductPriceLi>
                </ProductPriceUl>

                <ProductPriceUl mode={2}>
                    {/* [3] 부가설명 */}
                    <ProductPriceLi className="description" description={description}>
                        {description}
                    </ProductPriceLi>
                </ProductPriceUl>

            </ProductWrapper>
            {/* 상품 END */}
        </StyledItem>
    );
};

// ** props 기본값 지정 **
ProductItem.defaultProps = {
    itemImage: '',   
    itemName: '',    
    itemLink: '',     
    itemSize: [],     
    itemColors: [],
    price: 0,       
    sale: 0,       
    description: '',
};


// ** props 기본 타입 지정 **
ProductItem.propTypes = {
    itemImage: PropTypes.string,    
    itemName: PropTypes.string,     
    itemLink: PropTypes.string,     
    itemSize: PropTypes.array,      
    itemColors: PropTypes.array,    
    price: PropTypes.number,        
    sale: PropTypes.number,         
    description: PropTypes.string,
}



export default ProductItem;

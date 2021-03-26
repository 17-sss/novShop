import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import styled, { css } from 'styled-components';

import { getSize } from '../../lib/utility/customFunc';
import { ClearEx, CustomLink } from '../common/StyleUtilModels';
import { cssDisplayNone, cssStrike } from '../common/StyleUtilCSS';

// [1 START] ProductItem ====================== [export]
// 1) ProductItemCol: 상품 최상위 (Col) Wrapper
const ProductItemCol = styled(Col)`
    // height: ${getSize(1.6, 'height')};
    height: auto;
    /* border: 1px solid black; */
    padding: 15px;
`;

// 2) ProductItemWrapper: 상품 Wrapper
const ProductItemWrapper = styled.div`
    width: 100%;
`;

// 2-1) ProductItemImageWrapper: 상품 이미지 Wrapper
const ProductItemImageWrapper = styled.div`
    text-align: center;
    margin: 5px 0;
`;

// 2-2) ItemColorWrapper: 상품 색상 Wrapper
const ItemColorWrapper = styled.div`
    width: 100%;
    margin: 10px 0;
`;

// 2-2-1) ItemColor: 상품 색상
const ItemColor = styled.span`
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

// 2-3) ItemNameLink: 상품 상품명, 사이즈
const ItemNameLink = styled(CustomLink)`
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

// 2-4) ItemPriceUl: 상품 가격 & 부가설명 ul
const ItemPriceUl = styled.ul`
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

// 2-4-1) ItemPriceli: 상품 가격 & 부가설명 li
const cssNormalPrice = css`
    display: inline-block;
    color: black;
    font-size: 10pt;
    padding-right: 10px;
`;

const ItemPriceLi = styled.li`
    /* 일반 가격 */
    &.price {
        ${(props) => {
            const { sale, price } = props;

            if (!sale) {
                if (price) return cssNormalPrice;
                else return [cssDisplayNone, cssStrike];
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
            const { sale } = props;

            if (!sale) return [cssDisplayNone, cssStrike];
            else return cssNormalPrice;
        }}
    }

    /* 부가설명 */
    &.description {
        ${(props) => {
            const { description } = props;

            if (!description) {
                return [cssDisplayNone, cssStrike];
            } else {
                return css`
                    text-align: left;
                    position: relative;
                    /* margin: 4px auto 0px; 상 - 좌우 - 하 */
                    margin: 0 auto;
                    color: #666666;
                    font-size: 11.5px;
                    line-height: 22px; /* 이거쓰면 라인(글)이 밑으로 내려감, 굳이 마진 패딩안써도됨. */
                `;
            }
        }}
    }
`;
// [END] ProductItem ======================

// [2 START] ProductItemUpdate & ProductManagement ====================== [export]

// 1) ProductManagementWrapper
const ProductManagementWrapper = styled.div`
    ${(props) => props.isAdmin || cssDisplayNone};
    ${(props) =>
        props.operation === 'admin'
            ? css`
                  width: ${getSize(1.2)};
                  margin: 10px auto 0;          
                  text-align: center;        
              `
            : // (user - authority > 0의 경우에만 사용가능)
              css`
                  width: 100%;
                  text-align: right;
                  justify-content: right;
              `}
`;

// 2) ProductManagementBtn
const ProductManagementBtn = styled.button`
    border: none;
    font: inherit;
    outline: inherit;
    padding: 0.5rem;
    color: white;
    border-radius: 2px;
    font-size: 13px;

    background-color: ${(props) =>
        props.stype === 'update'
            ? '#2079ee'
            : props.stype === 'delete'
            ? '#ff1414'
            : '#ccc'};

    &:hover {
        background-color: ${(props) =>
            props.stype === 'update'
                ? '#5d9cee'
                : props.stype === 'delete'
                ? '#ff1f78'
                : ''};
        color: ${props => props.stype || '#f0f0f0'};
    }
`;
// [END] ProductManagementWrapper ======================

// [3 START] ProductEmpty ====================== [export]
// 1) ProductEmptyWrapper: 상품 데이터가 없을 경우 Wrapper
const ProductEmptyWrapper = styled.div`
    ${(props) =>
        props.stype === 'paddingWrap'
            ? css`
                  padding: ${getSize(3, 'height')} 0;
                  text-align: center;
              `
            : css`
                  width: ${getSize(1.35)};
                  margin: 0 auto;
              `}
`;
// [END] ProductEmpty ======================

// [4 START] ProductForm ====================== [export default]
// 1) ProductFormWrapper: 상품 폼 Wrapper (전체 틀)
const ProductFormWrapper = styled(Container)`
    width: ${getSize(1.2)};
    max-width: none !important;
    padding: 1% 0;
    margin: 0 auto;
`;

// 1-1) ProductFormRow
const ProductFormRow = styled(Row)`
    margin: 0 5% 0%;
`;
// [END] ProductForm ======================


// =======================================================================
// [START] ProductItem 템플릿 :: export
// =======================================================================
export const ProductItem = (props) => {
    const {
        itemImage, // 이미지: 이미지가 있는 위치
        itemName, // 상품명
        itemLink, // 상품링크
        itemSize, // 상품사이즈 정보
        itemColors, // 상품컬러 정보
        price, // 상품가격 - 일반가
        sale, // 상품가격 - 세일가
        description, // 상품 부가설명
    } = props;

    const { refs, events /*funcs*/ } = props;
    const { colRef, imgRef } = refs;
    const { imageOnLoad } = events;
    // 201025 안쓰는걸로.
    // const {imageTagHeight} = funcs;

    return (
        <ProductItemCol ref={colRef}>
            {/* [1] 이미지 START */}
            <ProductItemImageWrapper>
                <CustomLink to={itemLink}>
                    <img
                        ref={imgRef}
                        onLoad={imageOnLoad}
                        src={itemImage}
                        alt={itemName}
                        width="100%"
                        // height={imageTagHeight()} // 비활성. 굳이..
                    />
                </CustomLink>
            </ProductItemImageWrapper>
            {/* 이미지 END */}

            {/* [2] 상품 START */}
            <ProductItemWrapper>
                {/* 색상 */}
                <ItemColorWrapper>
                    {itemColors.map((v, i) => {
                        return <ItemColor key={i} color={v.key} />;
                    })}
                </ItemColorWrapper>

                <ClearEx style={{ padding: '2px 0' }} />

                {/* 상품명 & 사이즈 정보 */}
                <ItemNameLink to={itemLink}>
                    {itemName}

                    <span className="sizeInfo">
                        {itemSize.map((value, i) => {
                            const thisLen = itemSize.length;
                            if (i === thisLen - 1) {
                                if (thisLen === 1) return '[' + value + ']';
                                else return value + ']';
                            } else if (i === 0) {
                                return '[' + value + ', ';
                            } else {
                                return value + ', ';
                            }
                        })}
                    </span>
                </ItemNameLink>

                {/* 상품가격 */}
                <ItemPriceUl mode={1}>
                    {/* [1] 일반  */}
                    <ItemPriceLi className="price" price={price} sale={sale}>
                        {price}원
                    </ItemPriceLi>

                    {/* [2] 세일 */}
                    <ItemPriceLi className="sale" sale={sale}>
                        {Math.round(price - price * sale)}원                        
                    </ItemPriceLi>
                </ItemPriceUl>

                <ItemPriceUl mode={2}>
                    {/* [3] 부가설명 */}
                    <ItemPriceLi
                        className="description"
                        description={description}
                    >
                        {description}
                    </ItemPriceLi>
                </ItemPriceUl>
            </ProductItemWrapper>
            {/* 상품 END */}

            <ClearEx />
        </ProductItemCol>
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
};
// =======================================================================
// [END] ProductItem 템플릿 :: export
// =======================================================================

// =======================================================================
// [START] ProductItemUpdate / ProductManament 템플릿 :: export
// =======================================================================
export const ProductItemUpdate = (props) => {
    const { events, isAdmin, id } = props;
    const { onUpdate, onDelete } = events;

    return (
        <ProductManagementWrapper isAdmin={isAdmin}>
            <ProductManagementBtn value={id} onClick={onUpdate} stype="update">
                수정
            </ProductManagementBtn>
            <ProductManagementBtn value={id} onClick={onDelete} stype="delete">
                삭제
            </ProductManagementBtn>
        </ProductManagementWrapper>
    );
};

export const ProductManament = (props) => {
    const { events, isAdmin } = props;
    const { onVisible } = events;

    return (
        <ProductManagementWrapper isAdmin={isAdmin} operation="admin">
            <ProductManagementBtn onClick={onVisible}>
                상품 관리 버튼 제어
            </ProductManagementBtn>
        </ProductManagementWrapper>
    );
};
// =======================================================================
// [END] ProductItemUpdate / ProductManament 템플릿 :: export
// =======================================================================

// =======================================================================
// [START] ProductEmpty 템플릿 :: export
// =======================================================================
export const ProductEmpty = () => {
    return (
        <ProductEmptyWrapper>
            <ProductEmptyWrapper stype="paddingWrap">
                <h4>상품이 없습니다</h4>
            </ProductEmptyWrapper>
        </ProductEmptyWrapper>
    );
};
// =======================================================================
// [END] ProductEmpty 템플릿 :: export
// =======================================================================

// =======================================================================
// [START] ProductTemplate 템플릿 :: export default
// 구) ProductForm임 ProductTemplate로 명칭변경.
// =======================================================================
const ProductTemplate = (props) => {
    const { children } = props;
    return (
        <ProductFormWrapper>
            <ProductFormRow className="row-cols-4">{children}</ProductFormRow>
        </ProductFormWrapper>
    );
};
// =======================================================================
// [END] ProductTemplate 템플릿 :: export default
// =======================================================================

export default ProductTemplate;

import React from 'react';
import styled, { css } from 'styled-components';
import { getSize } from '../../lib/utility/customFunc';
import { /*StyledHr,*/ ClearEx, BorderBotLine } from '../common/StyleUtilModels';

import productDataList from '../../lib/data/productList.json';

// 각종 함수 or 변수 START ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
const calcImageRatio = (AnNum, AstrType) => {
    const strType = AstrType !== ('width' && 'height') ? 'err' : AstrType;
    const nDiv10 = Number(getSize(1.5, strType, false, true)) / 10;
    return nDiv10 * AnNum + 'px';
};

// 각종 함수 or 변수 END ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

// ========================================================================================
// [1] 상품 공통
// ========================================================================================
// 1) 상품 상세 -  Wrapper
const PdDetailWrapper = styled.div`
    margin: 0 auto;

    ${(props) => {
        const { mode } = props;
        const caseMode = mode !== ('detail' && 'additional') ? 'detail' : mode;

        switch (caseMode) {
            case 'detail': {
                return css`
                    width: ${getSize(1.8)};
                `;
            }
            case 'additional': {
                return css`
                    width: ${getSize(1.4)};
                `;
            }

            default:
                break;
        }
    }}
`;
// ---------------------------------------------------/

// 2) 상품 상세 - 다용도 wrapper
const ProductMultiWrapper = styled.div`
    ${(props) => {
        const { mode, height, width, margin } = props;
        const caseMode = mode !== ('detail' && 'additional') ? 'detail' : mode;

        switch (caseMode) {
            case 'detail': {
                return css`
                    height: ${() => height || calcImageRatio(5, 'width')};                    
                    display: inline-block;
                    float: left;
                    width: ${() => width || '50%'};   
                    margin: ${() => margin && margin};   
                `;
            }
            case 'additional': {
                return css``;
            }
            default:
                break;
        }
    }}
`;
// ---------------------------------------------------/

// 3) 상품 상세 - DetailWrapper간의 여백
const PaddingTB20 = styled.div`
    width: 100%;
    padding: 20px 0;
`;
// ---------------------------------------------------/

// ========================================================================================
// [2] 상품 이미지
// ========================================================================================
// 1) 상품 이미지 - Wrapper
const ProductImageWrapper = styled.div`
    height: 90%;
    overflow: hidden;    
                                
    /* align-items: center;
    justify-content: center;      
    text-align: center; */
       
    img {
        max-height: 100%;
        max-width: 100%;
        height: 100%;
        width: auto;
    }
`;
// ---------------------------------------------------/

// ========================================================================================
// [3] 상품 색상 정보
// ========================================================================================
// 1) 상품 색상 정보 - 사각형 Wrapper
const ProductSquareColorWrapper = styled.div`
    width: 100%;
    height: 20px;
    margin: 10px 0;
`;
// ---------------------------------------------------/

// 2) 상품 색상 정보 - 사각형 Item
const ProductSquareColor = styled.span`
    width: 16px;
    height: 16px;
    margin-right: 2px;
    float: left;
    box-sizing: border-box;
    border: 1px solid #e3e3e5;
    font-size: 0;
    line-height: 0;

    background-color: ${(props) => (props.color ? props.color : 'black')};
`;
// ---------------------------------------------------/

// ========================================================================================
// [4] 상품 일반 정보
// ========================================================================================
// 1) 상품 일반 정보 - 상품명, 부가설명, 상품가, 마일리지 Wrapper
const ProductInfoWrapper = styled.div`
    position: relative;    
    text-align: left;

    /* 상품명 */
    p.it_name {
        font-weight: bold;
        font-size: 14px;

        span.it_size {
            font-size: 12px;
            color: #ababab;
            margin-left: 4px;
            font-weight: normal;
        }
    }

    /* 부가설명 */
    p.it_desc {
        padding: 5px 0 12px 0;
        color: #ababab;
        font-size: 13px;
    }

    /* 상품 가격 & 마일리지 */
    p.it_price, p.it_mileage {
        padding : 8px 0;
        overflow: hidden;
        
        span.price_caption, span.mile_caption {            
            font-size: 12px;
            font-family: "Martel Sans", "Nanum Gothic";
            width: 85px;
            display: inline-block;
        }

        span.price, span.mileage {
            font-size: 12px;
            display: inline-block;
        }
    }

    /* 구매 관련 설명 */
    p.buy_ea {
        font-size: 12px;
        color: #ababab;
    }
    p.buy_desc {
        padding-top: 5px;
        font-size: 12px;
        color: red;
    }
`;
// ---------------------------------------------------/

// 2.1) 상품 일반 정보 - SelectBOX
const ProductInfoSelectBox = styled.select`
    width: 250px;
`;

// 2.2) 상품 일반 정보 - 색상, 사이즈 정보 & SelectBOX (종류: p Tag, ProductInfoSelectBox 포함하여 래핑.) 
const ProductInfoSelectP = styled.p`
    padding : 8px 0;
    overflow: hidden;   

    span.select_caption {            
        font-size: 12px;
        font-family: "Martel Sans", "Nanum Gothic";
        width: 85px;
        display: inline-block;
    }

    ${ProductInfoSelectBox} {
        display: inline-block;
    }
`;
// ---------------------------------------------------/


// ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●

const ProductDetailTemplate = (props) => {
    // 추후 container 단 START ----------
    const { itemId } = props.query;

    const productData = productDataList.find((item) => { // 추후에 백앤드로 findOne 하기.
        return item.itemId === Number(itemId);
    });

    const {
        itemName,
        itemImage,
        itemSize,
        itemColors,
        // eslint-disable-next-line
        price,
        // eslint-disable-next-line
        sale,
        description,
    } = productData;

    // 추후 container 단 END -------

    return (
        <>
            <PaddingTB20 />
            {/* 상품 상세 :: 구매, 이미지, 가격 등 */}
            <PdDetailWrapper>

                {/* 상품 이미지, 색상정보(사각형) */}
                <ProductMultiWrapper width="41%" margin= "0 0 0 9%">                            {/* 추후에 이미지 사이즈에 따라 조정하기 */}
                    <ProductImageWrapper>
                        <img src={itemImage} alt={itemName} />
                    </ProductImageWrapper>
                    
                    <ProductSquareColorWrapper>
                        {itemColors.map((v, i) => {
                            return <ProductSquareColor key={i} color={v} />;
                        })}
                    </ProductSquareColorWrapper>               
                </ProductMultiWrapper>

                {/* 상품의 전반적인 정보 및 구매 & 장바구니 */}                
                <ProductMultiWrapper width="46%" margin= "0 0 0 4%">                            {/* 추후에 이미지 사이즈에 따라 조정하기 */}
                    <ProductInfoWrapper>
                        {/* 상품명, 사이즈정보, 부가설명 */}
                        <p className="it_name">
                            {itemName}
                            <span className="it_size">
                                {'[' + itemSize.join(', ') + ']'}
                            </span>
                        </p>
                        <p className="it_desc">{description}</p>

                        <BorderBotLine margin = "12px 0" width = "100%" color= "#e6e6e6" />
                        
                        {/* 가격, 마일리지 */}
                        <p className="it_price">
                            <span className="price_caption">Price</span>
                            <span className="price">{price}원</span>
                        </p>
                        <p className="it_mileage">
                            <span className="mile_caption">Mileage</span>
                            <span className="mileage">{(price * 0.01)}원</span>
                        </p>

                        <BorderBotLine margin = "12px 0" width = "100%" color= "#e6e6e6" />

                        {/* 색상 선택 */}
                        <ProductInfoSelectP>
                            <span className="select_caption">Color</span>        
                            <ProductInfoSelectBox
                                defaultValue={"- [필수] 옵션을 선택해 주세요 -"}
                            >  
                                <option>- [필수] 옵션을 선택해 주세요 -</option>
                                {itemColors.map((v, i) => {
                                    return <option key={i}>{v}</option>;
                                })}
                            </ProductInfoSelectBox>           
                        </ProductInfoSelectP>

                        <BorderBotLine margin = "12px 0" width = "100%" color= "#e6e6e6" />
                        
                        {/* 사이즈 선택 */}
                        <ProductInfoSelectP>
                            <span className="select_caption">Size</span>        
                            <ProductInfoSelectBox
                                defaultValue={"- [필수] 옵션을 선택해 주세요 -"}
                            >  
                                <option>- [필수] 옵션을 선택해 주세요 -</option>
                                {itemSize.map((v, i) => {
                                    return <option key={i}>{v}</option>;
                                })}
                            </ProductInfoSelectBox>           
                        </ProductInfoSelectP>

                        <BorderBotLine margin = "12px 0" width = "100%" color= "#e6e6e6" />
                        
                        {/* 구매관련 설명 */}
                        <div>
                            <p className = "buy_ea">(최소주문수량 1개 이상)</p>
                            <p className = "buy_desc">
                                위 옵션선택 박스를 선택하시면 아래에 상품이 추가됩니다.
                            </p>
                        </div>
                        <BorderBotLine margin = "12px 0" width = "100%" color= "#e6e6e6" />
                        
                        {/* 선택 품목 리스트 (조건부 visible) */}
                        <BorderBotLine margin = "12px 0" width = "100%" color= "#e6e6e6" />
                        
                        {/* 총상품금액(수량), 구매 & 장바구니추가 btn */}
                        <BorderBotLine margin = "12px 0" width = "100%" color= "#e6e6e6" />


                    </ProductInfoWrapper>
                </ProductMultiWrapper>

                <ClearEx />
                <PaddingTB20 />
            </PdDetailWrapper>

            {/* 미구현 ----------------------------------------------------------------------- */}
            {/* <StyledHr /> */}

            {/* 상품 상세 :: 추가정보(제품 상세정보) */}
            {/* <PdDetailWrapper mode={'additional'}>
                Test2
            </PdDetailWrapper> */}
        </>
    );
};

export default ProductDetailTemplate;

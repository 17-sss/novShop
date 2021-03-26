import React from 'react';
import styled, { css } from 'styled-components';
import ReviewQATableContainer from "../../containers/table/ReviewQATableContainer";
import { getSize, calcImageRatio } from '../../lib/utility/customFunc';
import { ClearEx, BorderBotLine } from '../common/StyleUtilModels';
import { cssStrike, cssTransparent } from '../common/StyleUtilCSS';
import { Container, Row, Col, Navbar, Nav, NavLink } from 'react-bootstrap';
import ContentView from '../common/ContentView';

import ProductDetailAddInfo from './ProductDetailAddInfo';

// {0} 공통 ***************************************************************************************************************************
// ========================================================================================
// [1] 공통
// ========================================================================================
// 1) 상품 - 전체 Wrapper ('buy' or 'detail')
const PdDetailWrapper = styled.div`
    margin: 0 auto;
    
    ${(props) => {
        const { mode } = props;
        const caseMode = mode !== 'detail' ? 'buy' : mode;

        switch (caseMode) {
            case 'buy': {
                return css`
                    /* width: ${getSize(1.95)}; */
                    width: ${getSize(1.7)};
                `;
            }
            case 'detail': {
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
    padding: ${(props) => props.padding || '0 30px'};
    ${(props) => {
        const { mode, height, width, margin } = props;
        const caseMode = mode !== ('buy' && 'detail') ? 'buy' : mode;

        switch (caseMode) {
            case 'buy': {
                return css`
                    height: ${ height || calcImageRatio(5, 'width')};                    
                    display: inline-block;
                    float: left;
                    width: ${width || '50%'};
                    margin: ${margin && margin};
                `;
            }
            case 'detail': {
                return css``;
            }
            default:
                break;
        }
    }}
`;
// ---------------------------------------------------/

// ========================================================================================
// [2] 기타 (padding, hr 등)
// ========================================================================================
// 1) padding top, bottom 20 여백
const PaddingTB20 = styled.div`
    width: 100%;
    padding: 20px 0;
`;
// ---------------------------------------------------/

// 2) pdDetailWrapper 간의 구분선 ("detail" or "detail")
const StyledHr = styled.hr`
    width: ${getSize(1)};
    margin: 0 auto;
`;
// ---------------------------------------------------/




// {1} 상품 상세 Wraaper 관련 ***************************************************************************************************************************

// ========================================================================================
// [1] 상품 이미지
// ========================================================================================
// 1) 상품 이미지 - Wrapper
const ProductImageWrapper = styled.div`
    /* height: 90%; */
    overflow: hidden;

    /* align-items: center;
    justify-content: center;      
    text-align: center; */

    img {
        max-height: 100%;
        max-width: 100%;
        ${(props) => {
            const { imgClientSize, mode } = props;
            if (!imgClientSize)
                return css`
                    width: 100%;
                `;

            const { width, height } = imgClientSize;
            if (width <= 0 || height <= 0)
                return css`
                    width: 100%;
                `;

            // 구조상 mode = height는 쓸필요 없으나 그냥 만듬
            switch (mode) {
                case 'width':
                    return css`
                        width: ${width + 'px'};
                        height: auto;
                    `;
                case 'height':
                    return css`
                        width: auto;
                        height: ${height + 'px'};
                    `;
                default:
                    return css`
                        width: 100%;
                    `;
            }
        }}
    }
`;
// ---------------------------------------------------/

// ========================================================================================
// [2] 상품 색상 정보
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
// [3] 상품 일반 정보
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

    /* 상품 가격 & 마일리지 */
    p.it_price,
    p.it_mileage {
        /*  Wrapper (p 태그) */
        padding: 8px 0;
        overflow: hidden;
    }

    span.price_caption,
    span.mile_caption {
        /* caption */
        font-size: 12px;
        font-family: 'Martel Sans', 'Nanum Gothic';
        width: 85px;
        display: inline-block;
    }

    /* 부가설명 */
    p.it_desc {
        padding: 5px 0 12px 0;
        color: #ababab;
        font-size: 13px;
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

// 1.1) 상품 가격 & 마일리지 표시용
const ProductPriceViewSpan = styled.span`
    ${(props) => {
        const { sale } = props;
        return css`
            font-size: 12px;
            display: inline-block;
            ${sale &&
            css`
                ${cssStrike}
                margin-right: 8px;
            `}
        `;
    }}
`;
// ---------------------------------------------------/

// 2.1) 상품 일반 정보 - SelectBOX
const ProductInfoSelectBox = styled.select`
    width: 250px;
`;

// 2.2) 상품 일반 정보 - 색상, 사이즈 정보 & SelectBOX (종류: p Tag, ProductInfoSelectBox 포함하여 래핑.)
const ProductInfoSelectP = styled.p`
    padding: 8px 0;
    overflow: hidden;

    span.select_caption {
        font-size: 12px;
        font-family: 'Martel Sans', 'Nanum Gothic';
        width: 85px;
        display: inline-block;
    }

    ${ProductInfoSelectBox} {
        display: inline-block;
    }
`;
// ---------------------------------------------------/

// ========================================================================================
// [4] 선택한 상품 옵션 View (with Bootstrap)
// ========================================================================================
const ProductSelOptCol = styled(Col)`
    padding: 0;
    font-size: 12px;

    ${(props) => {
        let { align, lineheight, padding } = props;
        if (!align) align = 'left';
        return css`
            align-items: ${align};
            justify-content: ${align};
            text-align: ${align};
            ${lineheight &&
            css`
                line-height: ${lineheight};
            `};
            ${padding &&
            css`
                padding: ${padding};
            `}
        `;
    }};

    div#volume_wrap {
        position: relative;
        top: 18px;

        input[type='number']::-webkit-inner-spin-button,
        input[type='number']::-webkit-outer-spin-button {
            //-webkit-appearance: "Always Show Up/Down Arrows";
            opacity: 1;
        }
    }

    div#sel_price_wrap {
        position: relative;
        top: 10px;
    }

    p#sizeinfo {
        font-weight: bold;
    }

    p#colorsize{
        color: #6c6565;
    }
`;
// ---------------------------------------------------/

// ========================================================================================
// [5] 버튼 (구매, 장바구니)
// ========================================================================================
const ProductInputBtns = styled.input`
    margin-top: 10px;

    ${cssTransparent};

    ${(props) => {
        const { mode } = props;
        switch (mode) {
            case 'buy': {
                return css`
                    width: 100%;
                    height: 50px;
                    background-color: #1c4fe9;
                    color: white;
                    &:hover {
                        background-color: #3759be;
                        color: white;
                    }
                `;
            }
            default:
                break;
        }
    }}
`;
// ---------------------------------------------------/




// {2} 상품 추가정보 Wraaper 관련 ***************************************************************************************************************************

// ========================================================================================
// [1] 추가 정보 관련 버튼 (현 페이지 내 이동 관련)
// ========================================================================================
// 1.1) 추가정보용 버튼 Wrapper (with Bootstrap)
const ProductAddInfoBtnsWrapper = styled(Navbar)`
    width: ${getSize(1.7)};
    margin: 0 auto;

    align-items: center;
    justify-content: center;
    text-align: center;
`;

// 1.2) Nav (with bootstrap)
const StyledNav = styled(Nav)`
    margin: 0 auto;
`;

// 1.3) 추가정보용 버튼 
const ProductAddInfoLink = styled(NavLink)`
    ${cssTransparent};
    margin: 0 2.5rem;
    width: 100px;
    height: 20px;        
    box-shadow: 0 0.3px 0 0;

    &:hover{        
        box-shadow: 0 0.5px 0 0;
    }
`;
// ---------------------------------------------------/

// ========================================================================================
// [2] 추가 정보 - 분류를 구분하는 큰 글자 
// ========================================================================================
const ProductAddInfoBigName = styled.div`
    position: relative;
    display: inline-block;
    width: 100%;
    margin: ${(props) =>
        props.children === 'REVIEW'
            ? '60px auto 40px'
            : '40px auto 40px'};
    font-size: 24px;
    height: 44px;
    line-height: 44px;
    font-weight: 100;
    text-align: center;
    opacity: 0.9;
`;
// // ---------------------------------------------------/

// ========================================================================================
// [3] INFO 전용 DIV
// ========================================================================================
const ProductAddInfoTextWrapper = styled.div`
    width: ${getSize(2)};
    margin: 0 auto;    
    padding-left: 6rem;

    h6{
        font-weight: bold;
    }
`;

// ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●● ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●● 

const ProductDetailTemplate = (props) => {
    const { productData, productSelectItems, refs, events, imgDivInfo, reviewStatus, qaStatus } = props;

    const {
        // categoryId,
        // categorySub,
        name,
        colors,
        sizes,
        description,
        image,
        price,
        sale,
        detailinfo,
    } = productData;

    const {colorRef, sizeRef} = refs;
    const { onOptionConfirmation, onVolumeChange, onOptionDelete, onAddReviewTest, onAddQATest } = events;    
    const { imgRef, imgClientSize } = imgDivInfo;

    return (
        <>            
            <PaddingTB20 />
            {/* 상품 상세 :: 구매, 이미지, 가격 등 ====================================================================================================== [## 1] */}
            <PdDetailWrapper>
                {/* 상품 이미지, 색상정보(사각형) */}
                <ProductMultiWrapper height="auto">
                    {/* 추후에 이미지 사이즈에 따라 조정하기 */}
                    <ProductImageWrapper
                        ref={imgRef}
                        imgClientSize={imgClientSize && imgClientSize}
                        mode={'width'}
                    >
                        <img src={image} alt={name} />
                    </ProductImageWrapper>
                    <ProductSquareColorWrapper>
                        {colors &&
                            colors.map((v, i) => {
                                return (
                                    <ProductSquareColor key={i} color={v.key} />
                                );
                            })}
                    </ProductSquareColorWrapper>
                </ProductMultiWrapper>

                {/* 상품의 전반적인 정보 및 구매 & 장바구니 */}
                <ProductMultiWrapper height={"auto"}>
                    {/* 추후에 이미지 사이즈에 따라 조정하기 */}
                    <ProductInfoWrapper>
                        {/* 상품명, 사이즈정보, 부가설명 */}
                        <p className="it_name">
                            {name}
                            <span className="it_size">
                                {sizes && '[' + sizes.join(', ') + ']'}
                            </span>
                        </p>
                        <p className="it_desc">{description}</p>

                        <BorderBotLine
                            margin="12px 0"
                            width="100%"
                            color="#e6e6e6"
                        />

                        {/* 가격, 마일리지 */}
                        <p className="it_price">
                            <span className="price_caption">Price</span>
                            <ProductPriceViewSpan sale={sale}>
                                {price}원
                            </ProductPriceViewSpan>
                            {sale > 0 && (
                                <ProductPriceViewSpan>
                                    <b>{price - (price * sale)}원</b>
                                </ProductPriceViewSpan>
                            )}
                        </p>
                        <p className="it_mileage">
                            <span className="mile_caption">Mileage</span>
                            <ProductPriceViewSpan>
                                {sale > 0
                                    ? Math.floor((price - (price * sale)) * 0.01)
                                    : Math.floor(price * 0.01)}
                                원
                            </ProductPriceViewSpan>
                        </p>

                        <BorderBotLine
                            margin="12px 0"
                            width="100%"
                            color="#e6e6e6"
                        />

                        {/* 색상 선택 */}
                        <ProductInfoSelectP>
                            <span className="select_caption">Color</span>
                            <ProductInfoSelectBox
                                defaultValue={'- [필수] 옵션을 선택해 주세요 -'}
                                onChange={onOptionConfirmation}
                                name="color_select"
                                ref={colorRef}
                            >
                                <option>- [필수] 옵션을 선택해 주세요 -</option>
                                {colors &&
                                    colors.map((v, i) => {
                                        return (
                                            <option key={i}>{v.value}</option>
                                        );
                                    })}
                            </ProductInfoSelectBox>
                        </ProductInfoSelectP>

                        <BorderBotLine
                            margin="12px 0"
                            width="100%"
                            color="#e6e6e6"
                        />

                        {/* 사이즈 선택 */}
                        <ProductInfoSelectP>
                            <span className="select_caption">Size</span>
                            <ProductInfoSelectBox
                                defaultValue={'- [필수] 옵션을 선택해 주세요 -'}
                                onChange={onOptionConfirmation}
                                name="size_select"
                                ref={sizeRef}
                            >
                                <option>- [필수] 옵션을 선택해 주세요 -</option>
                                {sizes &&
                                    sizes.map((v, i) => {
                                        return <option key={i}>{v}</option>;
                                    })}
                            </ProductInfoSelectBox>
                        </ProductInfoSelectP>

                        <BorderBotLine
                            margin="12px 0"
                            width="100%"
                            color="#e6e6e6"
                        />

                        {/* 구매관련 설명 */}
                        <div>
                            <p className="buy_ea">(최소주문수량 1개 이상)</p>
                            <p className="buy_desc">
                                위 옵션선택 박스를 선택하시면 아래에 상품이
                                추가됩니다.
                            </p>
                        </div>
                        <BorderBotLine
                            margin="12px 0"
                            width="100%"
                            color="#e6e6e6"
                        />

                        {/* Select 박스에서 선택한 옵션 View (조건부 visible) */}
                        {productSelectItems &&
                            productSelectItems.items.length > 0 &&
                            productSelectItems.items.map((v) => {
                                return (
                                    <Container key={v.id}>
                                        <Row>
                                            <ProductSelOptCol>
                                                <p>{v.name}</p>
                                                {sizes && (
                                                    <p id="sizeinfo">
                                                        {'[' + v.sizeinfo + ']'}
                                                    </p>
                                                )}
                                                <p id="colorsize">
                                                    - {v.color + '/' + v.size}
                                                </p>
                                            </ProductSelOptCol>
                                            <ProductSelOptCol align="right">
                                                <div id="volume_wrap">
                                                    <span>수량: </span>
                                                    <input
                                                        id={v.id}
                                                        type="number"
                                                        name="volume"
                                                        value={v.volume}
                                                        min="1"
                                                        max="20"                                                        
                                                        onChange={onVolumeChange}
                                                    />                                                                  
                                                    <input
                                                        id={v.id}
                                                        type="button"
                                                        value={'X'}
                                                        name="delThis"
                                                        onClick={onOptionDelete}

                                                        style={{
                                                            marginLeft: '4px',
                                                            width: '20px',
                                                            height: 'auto',
                                                        }}
                                                    />
                                                </div>
                                            </ProductSelOptCol>
                                            <ProductSelOptCol align="right">
                                                <div id="sel_price_wrap">
                                                    <p>{v.price}원</p>
                                                    <p>
                                                        적: &nbsp;{v.mileage}원
                                                    </p>
                                                </div>
                                            </ProductSelOptCol>
                                        </Row>
                                    </Container>
                                );
                            })
                        }                            

                        {/* 총상품금액(수량) */}
                        {productSelectItems &&
                            productSelectItems.items.length > 0 && (
                                <>
                                    <BorderBotLine
                                        margin="12px 0"
                                        width="100%"
                                        color="#e6e6e6"
                                    />
                                    <div>
                                        <p>총 상품금액(수량) : {productSelectItems.totalprice}원</p>
                                    </div>
                                </>
                            )}
                        {/* 구매 & 장바구니추가 btn */}
                        <ProductInputBtns
                            mode="buy"
                            type="button"
                            value={'BUY NOW'}
                        />
                    </ProductInfoWrapper>
                </ProductMultiWrapper>

                <ClearEx />                
            </PdDetailWrapper>

            <PaddingTB20 />
            <StyledHr />
            <PaddingTB20 />
                                

            {/* 상품 상세 :: 추가정보(제품 상세정보) ====================================================================================================== [## 2] */}
            <PdDetailWrapper mode={'detail'}>

                <ProductAddInfoBtnsWrapper>
                    <StyledNav>
                        <ProductAddInfoLink href="#review">REVIEW</ProductAddInfoLink>
                        <ProductAddInfoLink href="#detail">DETAIL</ProductAddInfoLink>
                        <ProductAddInfoLink href="#sizeinfo">SIZE INFO</ProductAddInfoLink>
                        {/* <ProductAddInfoLink href="#codi">CODI ITEM</ProductAddInfoLink> */}
                        <ProductAddInfoLink href="#qa">{"Q & A"}</ProductAddInfoLink>
                        <ProductAddInfoLink href="#info">INFO</ProductAddInfoLink>
                    </StyledNav>
                </ProductAddInfoBtnsWrapper>

                <ProductAddInfoBigName id="review">REVIEW</ProductAddInfoBigName>
                <ReviewQATableContainer type="review" subjects={["번호", "사진", "제목", "작성자", "평점"]} data={reviewStatus && reviewStatus.data} />
                    
                <ProductAddInfoBigName id="detail">DETAIL</ProductAddInfoBigName>
                <ContentView content={detailinfo} />

                {/* 사이즈 정보, 코디: 비활성 */}
                {/* <ProductAddInfoBigName id="sizeinfo">SIZE INFO</ProductAddInfoBigName>
                <ProductAddInfoBigName>CODI ITEM</ProductAddInfoBigName> */}

                <ProductAddInfoBigName id="qa">{"Q & A"}</ProductAddInfoBigName>
                <ReviewQATableContainer type="qa" subjects={["번호", "제목", "작성자", "날짜", "조회"]} data={qaStatus && qaStatus.data}/>

                
                {/* 텍스트 추가 정보 */}
                <ProductAddInfoBigName id="info">INFO</ProductAddInfoBigName>                            
                <ProductAddInfoTextWrapper>                
                    <ProductDetailAddInfo/>
                </ProductAddInfoTextWrapper>
                

                {/* --------------------------------------------------------------------------- */}
                <button onClick={onAddReviewTest}>RE</button> 
                    &nbsp;
                <button onClick={onAddQATest}>QA</button>       
            </PdDetailWrapper>

            <PaddingTB20/>
        </>
    );
};

export default ProductDetailTemplate;

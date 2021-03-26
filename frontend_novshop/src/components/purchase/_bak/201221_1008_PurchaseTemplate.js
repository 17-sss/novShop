// 구매 / 장바구니 Template
import React from 'react';
import styled, { css } from 'styled-components';
import PostNoSearchBtnContainer from '../../containers/common/PostNoSearchBtnContainer'
import { cssDisplayNone, cssStrike, cssTransparent } from '../common/StyleUtilCSS';
import { ClearEx } from '../common/StyleUtilModels';
import {
    CommonTableWrapper as PurchaseWrapper,
    CommonTableMultiWrapper,
    StyledTable,
    StyledTh,
    StyledTd,
    SubjectLink,
    EmptyWrapper,
} from '../common/CommonTableComponents';
import { threeDigitsComma } from "../../lib/utility/customFunc";

// [1 : import] Wrapper
// 1) PurchaseWrapper (as로 CommonTableWrapper 자체를 가져옴)
// 2) PurchaseMultiWrapper
const PurchaseMultiWrapper = styled(CommonTableMultiWrapper)`
    ${(props) => {
        const { stype, margin } = props;        
        return stype === 'totalinfo'
            ? css`
                  width: 100%;
                  padding: 1rem 0;
                  border-bottom: 1px solid #e3e3e3;
                  background-color: #fbfafa;

                  span.totalprice {
                      font-size: 11.5pt;
                  }
                  .shippingfeeInfo {
                      margin-top: 10px;
                      text-align: center;
                  }                  
              `
            : stype === 'buy' &&
                  css`
                      width: 100%;                                            
                      margin: ${margin ? margin : "0 0 30px 0"};
                      
                      .buyInfoWrap {
                          /* border-top: 1px solid #e3e3e3; */
                          padding: 10px 0;
                          margin-top: 20px;
                      }

                      .float_left {
                          display: inline-block;
                          float: left;
                      }
                      .float_right {
                          display: inline-block;
                          float: right;
                      }
                      span.required_star {
                          color: red;                          
                          font-size: 10pt;                      
                          padding: 0 3px;                          
                      }
                  `;
    }}
`;

// ---------------------------------------------------/

// [2] Table 관련
// 1-1) table (import)
const PurchaseTable = styled(StyledTable)`
    ${(props) =>
        props.mode === 'buy'
            ? css`
                  border: none;
              `
            : css`
                  border-top: 1px solid #e3e3e3;
                  border-bottom: 1px solid #e3e3e3;
              `}

    font-size: 10pt;
`;

// 1-2) th (import)
const PurchaseTh = styled(StyledTh)`
    ${(props) =>
        props.mode === 'buy'
            ? css`
                // 구매 창
                  border: none;
                  background-color: #f6f6f6;
                  font-size: 9pt;
              `
            : css`
                // 장바구니 창
                  height: 35px;
                  border-bottom: 1px solid #e3e3e3;
              `}    
`;

// 1-3) td (import)
const PurchaseTd = styled(StyledTd)`
    border-bottom: none;

    ul > li > span.lightgray {
        color: #a0a0a0;
    }

    // 수량 조절 버튼 불투명하게
    input[type='number'][name='volume'] {
        text-align: center;

        ::-webkit-inner-spin-button,
        ::-webkit-outer-spin-button {
            opacity: 1;
        }
    }
`;

// 1-4) PurchaseBuyTr (no import, 구매창의 주문, 배송정보 Tr)
const PurchaseBuyTr = styled.tr`
    ${props => props.noStyle || css`border-bottom: 1px solid #e3e3e3;`};    
    /* line-height: 30px; */
`;

// 1-5) PurchaseBuyTd (no import, 구매창의 주문, 배송정보 Td)
const PurchaseBuyTd = styled.td`
    border-left: 1px solid #e3e3e3;
`;

// 1-6) PurchaseBuyInput & SelectBox (no import, 구매창의 주문, 배송정보 input & Select)
const cssPurchaseBuyInput = css`
    margin: 3px 0 3px 5px;    
    font-size: 10pt;
    
    border: 1px solid rgb(233, 233, 233);
    outline: none;

    &:focus {
        border: 1px solid rgb(209, 209, 209);
    }
`;

const PurchaseBuyInput = styled.input`    
    ${cssPurchaseBuyInput}
`;

const PurchaseBuySelect = styled.select`    
    ${cssPurchaseBuyInput}
`;

const PurchaseBuyTextArea = styled.textarea`    
    ${cssPurchaseBuyInput}    
    margin: 10px;    
    resize: ${props => props.resize ? props.resize : "both"};
    /* 
        !! resize (textarea 사이즈 조정)
        none;  사용자 임의 변경 불가  
        both;  사용자 변경이 모두 가능  
        horizontal;  좌우만 가능  
        vertical;  상하만 가능  
    */    
`;
// -------------|


// 2) PurchaseIsSaleP: 세일 여부에 따른 원가격표시
const PurchaseIsSaleP = styled.p`
    ${props => {
        const {sale} = props;
        const flag = (sale && sale > 0 && sale < 1);
        return flag ? cssStrike : cssDisplayNone;
    }}
`;

// ---------------------------------------------------/

// [3] 기타
// 1) button
const PurchaseBtn = styled.button`
    ${cssTransparent}
    display: inline-block;
    width: auto;
    height: 25px;

    ${(props) =>
        props.name === 'receiveInfoClean' ||
        props.name === 'orderInfoClean' ||
        props.name === 'orderReceiveSame'
            ? css`
                  margin-left: 5px;
              `
            : css`
                  margin-right: 10px;
              `}

    padding: 0 10px;

    border-radius: 2px;
    border: 1px solid #d1d1d1;

    background-color: ${(props) =>
        props.name === 'buyall' ||
        props.name === 'receiveInfoClean' ||
        props.name === 'orderInfoClean'
            ? '#c0c0c0'
            : 'white'};
    &:hover {
        background-color: ${(props) =>
            props.name === 'buyall' ||
            props.name === 'receiveInfoClean' ||
            props.name === 'orderInfoClean'
                ? '#d6d6d6'
                : '#e6e6e6'};
    }
`;

// ---------------------------------------------------/


const PurchaseTemplate = (props) => {
    const { etcs, data, events, refs } = props;
    const { page, colInfo, phoneFrontList } = etcs;
    const {
        onCartChange,
        onBuyChange,
        onItemDeleteClick,
        onBuyProductClick,
        onAddressInfoControl,
    } = events;
    const { allSelectRef } = refs;
        
    return (        
        <PurchaseWrapper>
            {/* == [1] 구매 / 장바구니 공용 ------------------------------------------------------------- */}
            <PurchaseMultiWrapper stype="pagename">
                <p id="pageType">
                    {page === 'shoppingcart'
                        ? '장바구니'
                        : page === 'buy'
                        ? '구매'
                        : ''}
                </p>
            </PurchaseMultiWrapper>
            
            <PurchaseMultiWrapper stype="table">                
            {data && data.items && data.items.length > 0 && (                
                <>    
                <PurchaseTable>
                    {/* 장바구니 / 구매 분류 정보 (thead) */}
                    <colgroup>
                        {colInfo &&
                            colInfo.width.map((v, i) => (
                                <col style={{ width: v + '%' }} key={i} />
                            ))}
                    </colgroup>
                    <thead>
                        <tr style={{ backgroundColor: '#fbfafa' }}>
                            {colInfo &&
                                colInfo.value.map((v, i) => (
                                    <PurchaseTh scope="col" key={i}>
                                        {v === 'check' ? (
                                            <input
                                                type="checkbox"
                                                name="allselect"  
                                                onChange={onCartChange}                                              
                                                ref={allSelectRef}
                                            />
                                        ) : (
                                            v
                                        )}
                                    </PurchaseTh>
                                ))}
                        </tr>
                    </thead>

                    {/* 구매할 상품 리스트 (tbody) */}
                    <tbody>                                                
                        {data && data.items && data.items.length > 0 && data.items.map((v, i) => {
                            const {
                                product: { image, name, price, sale, mileage, sizes, categoryId, categorySub },
                                id, selcolor, selsize, volume, productId, /* userId */
                            } = v;

                            let aLink = '/shopping';
                            if (!categoryId && !categorySub) {
                                aLink = aLink + `?itemId=${productId}`;
                            } else if (categoryId && !categorySub) {
                                aLink = aLink + `?main=${categoryId}&itemId=${productId}`;
                            } else if (categoryId && categorySub) {
                                aLink = aLink + `?main=${categoryId}&sub=${categorySub}&itemId=${productId}`;
                            }                            

                            const calcPrice = Math.round(price - (price * sale));
                            const fixMile = threeDigitsComma(Math.round(mileage * volume));
                            
                            return (
                                <tr key = {i}>
                                    {page === 'shoppingcart' && (
                                        <PurchaseTd>
                                            <input
                                                type="checkbox"
                                                name="select"
                                                checked={data.checkedItems.indexOf(id) > -1}
                                                onChange={onCartChange}
                                                id = {id}
                                            />                                            
                                        </PurchaseTd>
                                    )}

                                    <PurchaseTd>
                                        <div style={{ margin: '10px' }}>
                                            <img
                                                style={{ maxWidth: '75px' }}
                                                alt={name}
                                                src={'/uploads/' + image || '/images/bymono_test1.webp'}
                                            />
                                        </div>
                                    </PurchaseTd>
                                    <PurchaseTd align="left">
                                        <ul>
                                            <li>
                                                <SubjectLink
                                                    to={aLink}
                                                    style={{
                                                        margin: '0',
                                                        padding: '0',
                                                    }}
                                                >
                                                    {name}
                                                </SubjectLink>
                                            </li>
                                            <li>
                                                <b>{"[" + JSON.parse(sizes).join(", ") + "]"}</b>
                                            </li>
                                            <li>
                                                <span className="lightgray">
                                                    [옵션: {selcolor} / {selsize}]
                                                </span>
                                            </li>
                                        </ul>
                                    </PurchaseTd>
                                    <PurchaseTd>
                                        <PurchaseIsSaleP sale={sale}>
                                            {threeDigitsComma(price)}원                                            
                                        </PurchaseIsSaleP>
                                        <b>
                                            {sale && (sale > 0 && sale < 1) 
                                                ? (threeDigitsComma(calcPrice))
                                                : (threeDigitsComma(price))
                                            }원
                                        </b>                                        
                                    </PurchaseTd>
                                    <PurchaseTd>
                                        {page === 'shoppingcart' ? (
                                            <input
                                                type="number"
                                                min="1"
                                                max="20"
                                                name="volume"
                                                value={volume}
                                                onChange={onCartChange}
                                                id={id}
                                            />
                                        ) : (
                                            volume
                                        )}
                                    </PurchaseTd>
                                    
                                    <PurchaseTd>{fixMile}</PurchaseTd>                                                             
                                    <PurchaseTd>
                                        <b>{threeDigitsComma(calcPrice * volume)}원</b>
                                    </PurchaseTd> 
                                </tr>        
                            );
                        })}
                     </tbody>
                </PurchaseTable>

                {/* 총 상품금액 / btns (tfoot, div로 대체) */}
                <PurchaseMultiWrapper stype="totalinfo">
                    {/* [장바구니] 버튼 (삭제, 장바구니 비우기 등) */}
                    {page === 'shoppingcart' && (
                        <div style={{ float: 'left' }}>
                            <div style={{ marginLeft: '20px' }}>
                                <PurchaseBtn
                                    name="delselproduct"
                                    onClick={onItemDeleteClick}
                                >
                                    선택 상품 삭제
                                </PurchaseBtn>
                                <PurchaseBtn
                                    name="cleancart"
                                    onClick={onItemDeleteClick}
                                >
                                    장바구니 비우기
                                </PurchaseBtn>
                            </div>
                        </div>
                    )}
                    {/* 2) 총 상품금액 */}
                    <div style = {{float: "right"}}>                        
                        <span className="totalprice">
                            상품구매금액{' '}
                            <b>
                                {data && data.allProductPrice
                                    ? data.allProductPrice
                                    : 'ERR!!'}
                            </b>{' '}
                            + 배송비{' '}
                            <b>
                                {data && data.shippingFee
                                    ? data.shippingFee
                                    : 'ERR!!'}
                            </b>{' '}
                            = 합계 :{' '}
                            <b>
                                {data && data.totalPrice
                                    ? data.totalPrice
                                    : 'ERR!!'}
                            </b>
                            원
                        </span>
                        <ClearEx />

                        <div className="shippingfeeInfo">
                            <span>
                                상품구매금액{' '}
                                <b style={{color: "red", textDecoration: "underline"}}>
                                    30,000
                                </b>
                                {' '}이상 무료배송
                            </span>
                        </div>
                    </div>
                    <ClearEx />
                    
                </PurchaseMultiWrapper>
                
                {/* [장바구니] 상품 주문 버튼 */}
                {page === "shoppingcart" && (
                    <>
                    <div style={{ float: 'right', marginTop: '10px' }}>
                        <PurchaseBtn
                            name="buyall"
                            onClick={onBuyProductClick}
                        >
                            전체상품주문
                        </PurchaseBtn>
                        <PurchaseBtn
                            name="buyselect"
                            onClick={onBuyProductClick}
                        >
                            선택상품주문
                        </PurchaseBtn>
                    </div>
                    <ClearEx />
                    </>
                )}
                </>
            )}
            {(!data || !data.items || data.items.length <= 0) && (
                <EmptyWrapper>
                    <span>{page === "buy" ? '구매할 상품이 없습니다.' : '장바구니가 비어 있습니다.'}</span>
                </EmptyWrapper>
            )}
            </PurchaseMultiWrapper>

            {/* == [2] 구매 페이지 전용 ------------------------------------------------------------- */}
            {page === 'buy' &&
                [...Array(2)].map((v, index) => {                                      
                    return (
                        <div key = {index}>
                            <PurchaseMultiWrapper stype="buy" margin={index === 0 && "0 0 50px 0"}>
                                <div className="buyInfoWrap">
                                    <span className="float_left" style={{fontSize: "11pt"}}>
                                        {index ? '배송 정보' : '주문 정보'}
                                    </span>
                                    {index === 1 && (
                                        <PurchaseBtn
                                            className="float_left"
                                            name="orderReceiveSame"
                                            onClick={onAddressInfoControl}
                                        >
                                            주문정보와 같음
                                        </PurchaseBtn>
                                    )}
                                    <PurchaseBtn
                                        className="float_left"
                                        name={
                                            (index
                                                ? 'receiveInfo'
                                                : 'orderInfo') + 'Clean'
                                        }
                                        onClick={onAddressInfoControl}
                                    >
                                        초기화
                                    </PurchaseBtn>
                                    <span className="float_right" style={{fontSize: "11pt"}}>
                                        <span className="required_star">*</span>
                                        필수입력사항
                                    </span>
                                    <ClearEx />
                                </div>

                                <PurchaseTable mode="buy">
                                    <colgroup>
                                        <col style={{ width: '139px' }} />
                                        <col style={{ width: 'auto' }} />
                                    </colgroup>

                                    <tbody>
                                        <PurchaseBuyTr>
                                            <PurchaseTh scope="row" mode="buy">
                                                {index ? '받으시는 분' : '주문하시는 분'}
                                                <span className="required_star">
                                                    *
                                                </span>
                                            </PurchaseTh>
                                            <PurchaseBuyTd>
                                                <PurchaseBuyInput
                                                    name={index ? 'receiveUserName' : 'orderUserName'}
                                                    type="text"
                                                    onChange={onBuyChange}
                                                    value={index 
                                                        ? data.receiveInfo && data.receiveInfo.username 
                                                        : data.orderInfo && data.orderInfo.username}
                                                    autoComplete="off"                                                
                                                />
                                            </PurchaseBuyTd>
                                        </PurchaseBuyTr>
                                        <PurchaseBuyTr>
                                            <PurchaseTh scope="row" mode="buy">
                                                주소
                                                <span className="required_star">
                                                    *
                                                </span>
                                            </PurchaseTh>
                                            <PurchaseBuyTd>
                                                <PurchaseBuyInput
                                                    name={index ? 'receiveAddressPostNo' : 'orderAddressPostNo'}
                                                    type="text"                                                    
                                                    value={index 
                                                        ? data.receiveInfo &&  data.receiveInfo.address.addressPostNo 
                                                        : data.orderInfo && data.orderInfo.address.addressPostNo}
                                                    placeholder="우편번호"
                                                    readOnly="1"    // readOnly는 onChange 없어도..
                                                />
                                                &nbsp;
                                                {/* 우편번호 검색 API용 Container */}
                                                <PostNoSearchBtnContainer
                                                    typeId={index ? 'receive' : 'order'}
                                                />       
                                                {/* -- */}
                                                <br />                                                
                                                <PurchaseBuyInput
                                                    name={index ? 'receiveAddressAddr1' : 'orderAddressAddr1'}
                                                    type="text"                                                    
                                                    value={index 
                                                        ? data.receiveInfo && data.receiveInfo.address.addressAddr1 
                                                        : data.orderInfo && data.orderInfo.address.addressAddr1}
                                                    placeholder="기본주소"
                                                    size="60"
                                                    readOnly="1"
                                                />
                                                <br />
                                                <PurchaseBuyInput
                                                    name={index ? 'receiveAddressAddr2' : 'orderAddressAddr2'}
                                                    type="text"
                                                    onChange={onBuyChange}
                                                    value={index 
                                                        ? data.receiveInfo && data.receiveInfo.address.addressAddr2 
                                                        : data.orderInfo && data.orderInfo.address.addressAddr2}
                                                    placeholder="나머지주소 (선택입력가능)"
                                                    size="60"                                  
                                                />
                                            </PurchaseBuyTd>
                                        </PurchaseBuyTr>

                                        <PurchaseBuyTr noStyle={index === 0 && true}>
                                            <PurchaseTh scope="row" mode="buy">
                                                연락처
                                                <span className="required_star">
                                                    *
                                                </span>
                                            </PurchaseTh>
                                            <PurchaseBuyTd>
                                                <PurchaseBuySelect
                                                    name={index ? 'receivePhoneNumSelect' : 'orderPhoneNumSelect'}                                                    
                                                    onChange={onBuyChange}                                                    
                                                    value={index 
                                                        ? data.receiveInfo && data.receiveInfo.phonenumber.phoneNumSelect 
                                                        : data.orderInfo && data.orderInfo.phonenumber.phoneNumSelect}  
                                                >
                                                    {phoneFrontList.map((v, i) => (
                                                        <option value={v} key={i}>
                                                            {v}
                                                        </option>
                                                    ))}
                                                </PurchaseBuySelect>
                                                -
                                                <PurchaseBuyInput
                                                    name={index ? 'receivePhoneNum1' : 'orderPhoneNum1'}                                                    
                                                    type="text"
                                                    onChange={onBuyChange}
                                                    value={index 
                                                        ? data.receiveInfo && data.receiveInfo.phonenumber.phoneNum1 
                                                        : data.orderInfo && data.orderInfo.phonenumber.phoneNum1}                                                    
                                                    maxLength="4"
                                                    size="4"
                                                />
                                                -
                                                <PurchaseBuyInput
                                                    name={index ? 'receivePhoneNum2' : 'orderPhoneNum2'}
                                                    type="text"
                                                    onChange={onBuyChange}
                                                    value={index 
                                                        ? data.receiveInfo && data.receiveInfo.phonenumber.phoneNum2 
                                                        : data.orderInfo && data.orderInfo.phonenumber.phoneNum2}  
                                                    maxLength="4"
                                                    size="4"
                                                />
                                            </PurchaseBuyTd>
                                        </PurchaseBuyTr>

                                        {index === 1 &&
                                        (<PurchaseBuyTr noStyle>
                                            <PurchaseTh scope="row" mode="buy">
                                                배송메세지
                                            </PurchaseTh>
                                            <PurchaseBuyTd>
                                                <PurchaseBuyTextArea 
                                                    rows="3"
                                                    cols="100"
                                                    name="deliveryMessage"
                                                    onChange={onBuyChange}
                                                    value={data.receiveInfo && data.receiveInfo.deliveryMessage}
                                                    resize="none"                                 
                                                />
                                            </PurchaseBuyTd>
                                        </PurchaseBuyTr>)
                                        }                                          
                                    </tbody>
                                </PurchaseTable>
                                
                            </PurchaseMultiWrapper>
                            {index === 0 && <hr/>}
                        </div>
                    );
                })}
            
        </PurchaseWrapper>
    );
};

export default PurchaseTemplate;

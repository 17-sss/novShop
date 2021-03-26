// 구매 Template
// 2020.12.21 10:08 기준으로 장바구니 / 구매 통합되어 있던 것 분리.
import React from 'react';
import styled, { css } from 'styled-components';
import { ClearEx } from '../common/StyleUtilModels';
import { threeDigitsComma } from "../../lib/utility/customFunc";
import {    
    CommonTableWrapper as BuyWrapper,
    SubjectLink,
    EmptyWrapper,
} from '../common/CommonTableComponents';
import {
    PurchaseMultiWrapper, PurchaseTable, PurchaseTh, PurchaseTd, PurchaseIsSaleP, PurchaseBtn 
} from './StylePurchase';
import { cssTransparent } from '../common/StyleUtilCSS';

import PostNoSearchBtnContainer from '../../containers/common/PostNoSearchBtnContainer'


// [1] 구매창 전용 Style
// 1-1) PurchaseBuyTr (no import, 구매창의 주문, 배송정보 Tr)
const PurchaseBuyTr = styled.tr`
    ${props => props.noStyle || css`border-bottom: 1px solid #e3e3e3;`};    
    /* line-height: 30px; */
`;

// 1-2) PurchaseBuyTd (no import, 구매창의 주문, 배송정보 Td)
const PurchaseBuyTd = styled.td`
    border-left: 1px solid #e3e3e3;
`;

// 1-3) PurchaseBuyInput & SelectBox (no import, 구매창의 주문, 배송정보 input & Select)
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

// 1-4) PurchaseBuyBtn (no import, 구매창의 주문 버튼)
const PurchaseBuyItemsBtn = styled.button`
    ${cssTransparent}    
    width: 80px;
    height: 40px;
    padding: 0 10px;

    border-radius: 2px;
    border: 1px solid #d1d1d1;
    background-color: #89d9fb;
    color: white;

    &:hover {
        background-color: #a3e0fa;
    }
`;

// ---------------------------------------------------/


const BuyTemplate = (props) => {
    const { buyFormStatus, etcs, events } = props;
    const { colInfo, phoneFrontList } = etcs;
    const { onBuyChange, onAddressInfoControl, onBuySubmit } = events;
        
    return (        
        <BuyWrapper>            
            <PurchaseMultiWrapper stype="pagename">
                <p id="pageType">구매</p>
            </PurchaseMultiWrapper>
            
            <PurchaseMultiWrapper stype="table">                
            {buyFormStatus && buyFormStatus.items && buyFormStatus.items.length > 0 && (                
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
                                    <PurchaseTh scope="col" key={i}>{v}</PurchaseTh>
                                ))}
                        </tr>
                    </thead>

                    {/* 구매할 상품 리스트 (tbody) */}
                    <tbody>                                                
                        {buyFormStatus && buyFormStatus.items && buyFormStatus.items.length > 0 && buyFormStatus.items.map((v, i) => {
                            const {
                                product: { image, name, price, sale, mileage, sizes, categoryId, categorySub },
                                /*id,*/ selcolor, selsize, volume, productId, /* userId */
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
                                        {volume}
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
                    {/* 1) 총 상품금액 */}
                    <div style = {{float: "right"}}>                        
                        <span className="totalprice">
                            상품구매금액{' '}
                            <b>
                                {buyFormStatus && buyFormStatus.allProductPrice
                                    ? buyFormStatus.allProductPrice
                                    : 'ERR!!'}
                            </b>{' '}
                            + 배송비{' '}
                            <b>
                                {buyFormStatus && buyFormStatus.shippingFee
                                    ? buyFormStatus.shippingFee
                                    : 'ERR!!'}
                            </b>{' '}
                            = 합계 :{' '}
                            <b>
                                {buyFormStatus && buyFormStatus.totalPrice
                                    ? buyFormStatus.totalPrice
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
                </>
            )}
            {(!buyFormStatus || !buyFormStatus.items || buyFormStatus.items.length <= 0) && (
                <EmptyWrapper>
                    <span>구매할 상품이 없습니다.</span>
                </EmptyWrapper>
            )}
            </PurchaseMultiWrapper>

            {/* 주문정보 및 배송정보 */}
            {[...Array(2)].map((v, index) => {                                                      
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
                                                    ? buyFormStatus.receiveInfo && buyFormStatus.receiveInfo.username 
                                                    : buyFormStatus.orderInfo && buyFormStatus.orderInfo.username}
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
                                                    ? buyFormStatus.receiveInfo &&  buyFormStatus.receiveInfo.address.addressPostNo 
                                                    : buyFormStatus.orderInfo && buyFormStatus.orderInfo.address.addressPostNo}
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
                                                    ? buyFormStatus.receiveInfo && buyFormStatus.receiveInfo.address.addressAddr1 
                                                    : buyFormStatus.orderInfo && buyFormStatus.orderInfo.address.addressAddr1}
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
                                                    ? buyFormStatus.receiveInfo && buyFormStatus.receiveInfo.address.addressAddr2 
                                                    : buyFormStatus.orderInfo && buyFormStatus.orderInfo.address.addressAddr2}
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
                                                    ? buyFormStatus.receiveInfo && buyFormStatus.receiveInfo.phonenumber.phoneNumSelect 
                                                    : buyFormStatus.orderInfo && buyFormStatus.orderInfo.phonenumber.phoneNumSelect}  
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
                                                    ? buyFormStatus.receiveInfo && buyFormStatus.receiveInfo.phonenumber.phoneNum1 
                                                    : buyFormStatus.orderInfo && buyFormStatus.orderInfo.phonenumber.phoneNum1}                                                    
                                                maxLength="4"
                                                size="4"
                                            />
                                            -
                                            <PurchaseBuyInput
                                                name={index ? 'receivePhoneNum2' : 'orderPhoneNum2'}
                                                type="text"
                                                onChange={onBuyChange}
                                                value={index 
                                                    ? buyFormStatus.receiveInfo && buyFormStatus.receiveInfo.phonenumber.phoneNum2 
                                                    : buyFormStatus.orderInfo && buyFormStatus.orderInfo.phonenumber.phoneNum2}  
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
                                                value={buyFormStatus.receiveInfo && buyFormStatus.receiveInfo.deliveryMessage}
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
            
            <PurchaseMultiWrapper stype="buy">
                <div className="buyInfoWrap">                    
                    <PurchaseBuyItemsBtn
                        className="float_right"
                        name="buyItems"
                        onClick={onBuySubmit}
                    >
                        구매
                    </PurchaseBuyItemsBtn>
                    <ClearEx />
                </div>
            </PurchaseMultiWrapper>
            
        </BuyWrapper>
    );
};

export default BuyTemplate;

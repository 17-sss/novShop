// 장바구니 Template
// 2020.12.21 10:08 기준으로 장바구니 / 구매 통합되어 있던 것 분리.
import React from 'react';
import { ClearEx } from '../common/StyleUtilModels';
import { threeDigitsComma } from "../../lib/utility/customFunc";
import {    
    CommonTableWrapper as CartWrapper,
    SubjectLink,
    EmptyWrapper,
} from '../common/CommonTableComponents';
import {
    PurchaseMultiWrapper, PurchaseTable, PurchaseTh, PurchaseTd, PurchaseIsSaleP, PurchaseBtn 
} from './StylePurchase';

// ---------------------------------------------------/

const CartTemplate = (props) => {
    const { etcs, cartFormStatus, events, refs } = props;
    const { colInfo } = etcs;
    const {
        onCartChange,
        onItemDeleteClick,
        onBuyProductClick,
    } = events;
    const { allSelectRef } = refs;
        
    return (        
        <CartWrapper>
            <PurchaseMultiWrapper stype="pagename">
                <p id="pageType">장바구니</p>
            </PurchaseMultiWrapper>

            <PurchaseMultiWrapper stype="table">
            {cartFormStatus && cartFormStatus.items && cartFormStatus.items.length > 0 && (
                <>
                <PurchaseTable>
                    {/* 장바구니 분류 정보 (thead) */}
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
                        {cartFormStatus && cartFormStatus.items && cartFormStatus.items.length > 0 
                            && cartFormStatus.items.map((v, i) => {
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
                                        <PurchaseTd>
                                            <input
                                                type="checkbox"
                                                name="select"
                                                checked={cartFormStatus.checkedItems.indexOf(id) > -1}
                                                onChange={onCartChange}
                                                id = {id}
                                            />                                            
                                        </PurchaseTd>

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
                                            <input
                                                type="number"
                                                min="1"
                                                max="20"
                                                name="volume"
                                                value={volume}
                                                onChange={onCartChange}
                                                id={id}
                                            />                                            
                                        </PurchaseTd>
                                        
                                        <PurchaseTd>{fixMile}</PurchaseTd>                                                             
                                        <PurchaseTd>
                                            <b>{threeDigitsComma(calcPrice * volume)}원</b>
                                        </PurchaseTd> 
                                    </tr>        
                                );
                            })
                        }
                    </tbody>
                </PurchaseTable>
                {/* 총 상품금액 / btns (tfoot, div로 대체) */}
                <PurchaseMultiWrapper stype="totalinfo">
                    {/* 1) 삭제, 장바구니 비우기 버튼 */}                    
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
                    {/* 2) 총 상품금액 */}
                    <div style = {{float: "right"}}>
                        <span className="totalprice">
                            상품구매금액{' '}
                            <b>
                                {cartFormStatus && cartFormStatus.allProductPrice
                                    ? cartFormStatus.allProductPrice
                                    : 'ERR!!'}
                            </b>{' '}
                            + 배송비{' '}
                            <b>
                                {cartFormStatus && cartFormStatus.shippingFee
                                    ? cartFormStatus.shippingFee
                                    : 'ERR!!'}
                            </b>{' '}
                            = 합계 :{' '}
                            <b>
                                {cartFormStatus && cartFormStatus.totalPrice
                                    ? cartFormStatus.totalPrice
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

                {/* 장바구니 상품 주문 버튼 */}
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

            {(!cartFormStatus || !cartFormStatus.items || cartFormStatus.items.length <= 0) && (
                <EmptyWrapper>
                    <span>장바구니가 비어 있습니다.</span>
                </EmptyWrapper>
            )}
            </PurchaseMultiWrapper>
        </CartWrapper>
    );
};

export default CartTemplate;

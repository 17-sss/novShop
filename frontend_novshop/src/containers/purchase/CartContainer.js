// 장바구니 Container
// 2020.12.21 10:08 기준으로 장바구니 / 구매 통합되어 있던 것 분리.
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    changePurchaseCart,
    changePurchaseBuy,
    updCartVolume,
    getCart,
    initialPurchaseForm,
    delCartGoods
} from '../../modules/purchase';
import { threeDigitsComma } from '../../lib/utility/customFunc';

import CartTemplate from '../../components/purchase/CartTemplate';

const PurchaseContainer = (props) => {
    // [1] 기본 세팅
    // 1. redux 관련
    const {history} = props;    

    const dispatch = useDispatch();
    const { cartFormStatus, userData } = useSelector(
        ({ purchase, user, loading, util }) => {
            return {
                cartFormStatus: purchase.cartFormStatus,                
                userData: user.user,                    
            };
        },
    );

    // 2. useState & useRef    
    const [priceLoading, setPriceLoading] = useState(false);
    const [curUserId, setCurUserId] = useState(-1);
    const [isUpdateValue, setIsUpdateValue] = useState(false);    
    const allSelectRef = useRef(null);

    // 3. ETC
    // 1) 테이블 행 정보 세팅
    const colInfo = {
        value: ['check', '이미지', '상품정보', '판매가', '수량', '적립금', '합계'],
        width: ['3', '10', '47', '10', '10', '10', '10', '10'],
    };

    // -------------------------------------------------------------------------------------------------
    
    // [2] hooks 
    // 1. useEffect    

    // 1-1) 초기화: 유저
    useEffect(() => {
        setCurUserId(userData && userData.data ? userData.data.id : -1);
    }, [userData]);

    // 1-2) 초기화: 페이지
    useEffect(() => {
        if (isUpdateValue) setIsUpdateValue(false);
        
        dispatch(initialPurchaseForm({form: "cartFormStatus", subForm: ''}));                
        setPriceLoading(false);    
        
        if (curUserId !== -1) dispatch(getCart({ userId: curUserId }));        
    }, [dispatch, curUserId, isUpdateValue, userData,]);    

    // 3) 현재 목록 가격 계산 후 세팅 (상품구매금액, 배송비, 총금액)
    useEffect(() => {
        if (priceLoading) return;        
        if (
            cartFormStatus &&
            cartFormStatus.items &&
            cartFormStatus.items.length > 0
        ) {
            const onePriceResult = () => {
                const {
                    product: { price, sale },
                    volume,
                } = cartFormStatus.items[0];
                
                const result =
                    sale > 0 && sale < 1
                        ? (price - price * sale) * volume
                        : price * volume;
                
                return result;
            }

            const allProductPriceTmp =
                cartFormStatus.items.length > 1
                    ? cartFormStatus.items.reduce((prev, curr) => {
                          const {
                              product: { price: currPrice, sale: currSale },
                              volume: currVolume,
                          } = curr;

                          const currValue =
                              currSale > 0 && currSale < 1
                                  ? (currPrice - currPrice * currSale) *
                                    currVolume
                                  : currPrice * currVolume;

                          let prevValue = 0;
                          if (typeof prev === 'object') {
                              const {
                                  product: { price: prevPrice, sale: prevSale },
                                  volume: prevVolume,
                              } = prev;
                              prevValue =
                                  prevSale > 0 && prevSale < 1
                                      ? (prevPrice - prevPrice * prevSale) *
                                        prevVolume
                                      : prevPrice * prevVolume;
                          } else if (typeof prev === 'number') {
                              prevValue = prev;
                          }

                          return Math.round(Number(prevValue + currValue));
                      })
                    : cartFormStatus.items.length === 1 && onePriceResult();

            const shippingFeeTmp = allProductPriceTmp >= 30000 ? '무료' : 2500;
            const totalPriceTmp =
                shippingFeeTmp === '무료'
                    ? allProductPriceTmp
                    : allProductPriceTmp + shippingFeeTmp;

            dispatch(
                changePurchaseCart({
                    form: 'cartFormStatus',
                    key: 'allProductPrice',
                    value: threeDigitsComma(allProductPriceTmp),
                }),
            );
            dispatch(
                changePurchaseCart({
                    form: 'cartFormStatus',
                    key: 'shippingFee',
                    value:
                        shippingFeeTmp === '무료'
                            ? shippingFeeTmp
                            : threeDigitsComma(shippingFeeTmp),
                }),
            );
            dispatch(
                changePurchaseCart({
                    form: 'cartFormStatus',
                    key: 'totalPrice',
                    value: threeDigitsComma(totalPriceTmp),
                }),
            );

            const { allProductPrice, shippingFee, totalPrice } = cartFormStatus;
            if (!allProductPrice || !shippingFee || !totalPrice)
                setPriceLoading(false);
            else setPriceLoading(true);
        }
    }, [dispatch, priceLoading, cartFormStatus,]);

    // 4) 장바구니 상품들의 체크박스에 따른 전체선택 체크박스 제어    
    useEffect(() => {                
        if (!cartFormStatus || (cartFormStatus.items && cartFormStatus.items.length <= 0)) return;
        if (!allSelectRef.current) return;

        const { items, checkedItems } = cartFormStatus;

        if (!items || !checkedItems) return;
        if (!items instanceof Array || !checkedItems instanceof Array) return;        
                    
        if (cartFormStatus.checkedItems.length === cartFormStatus.items.length) 
            allSelectRef.current.checked = true
        else
            allSelectRef.current.checked = false;               
    }, [cartFormStatus]);

    // -------------------------------------------------------------------------------------------------


    // 3. 이벤트
    // 1) onCartChange, 장바구니의 수량, 체크박스 Change
    const onCartChange = useCallback(
        (e) => {            
            const { id, name: key, checked } = e.target;
            let { value } = e.target;            
            
            if (key === 'volume') {
                if (Number(value) > 20) value = 20;
                else if (Number(value) <= 0) value = 1;
            }
            /* 
                - dispatch changePurchaseCart의 매개변수 설명
                    1. addValue 사용할 경우 (form이 cartFormStatus)
                        1) name(key)이 volume일 경우
                            리덕스 모듈 (purchase)에서 cartFormStatus 폼안의 items를 수정함.
                    2. key와 value가 e.target에서 가져온 값이 아닌 다른 값으로 쓸 경우
                        1) name(key)이 select일 경우
                            key는 checkedItems가 되며, value는 id값. (id 값이 checkedItems에 들어가거나 수정되게 함)
            */
            dispatch(
                changePurchaseCart({
                    form: 'cartFormStatus',
                    key,
                    value:
                        key === 'select'
                            ? id
                            : key === 'allselect'
                            ? checked
                            : value,
                    addValue:
                        key === 'volume'
                            ? id && Number(id)
                            : key === 'select'
                            ? checked
                            : '',
                }),
            );

            if (key === 'volume') {
                dispatch(updCartVolume({ id, volume: value }));
                setPriceLoading(false);
            }
        },
        [dispatch],
    );    

    // 2) onItemDeleteClick (선택 상품 삭제, 장바구니 비우기)
    const onItemDeleteClick = useCallback((e) => {
        if (!cartFormStatus) return;
        
        const { name } = e.target;
        if (name === 'cleancart' && !cartFormStatus.items) return;
        if (name === 'delselproduct' && !cartFormStatus.checkedItems) return;

        if (cartFormStatus.items.length <= 0 && name === 'cleancart') 
            return alert('제거할 상품이 없습니다!')
        else if (cartFormStatus.checkedItems.length <= 0 && name === 'delselproduct') 
            return alert('제거하려는 상품을 선택해주세요!');
        
        let items = [];

        if (name === 'cleancart') {
            const tmpItems = cartFormStatus.items;
            tmpItems.map((v) => items.push(Number(v.id)));            
        } else if (name === 'delselproduct') {
            items = cartFormStatus.checkedItems;
        } else return;        
            
        dispatch(delCartGoods({ items }));
        setIsUpdateValue(true);
    }, [dispatch, cartFormStatus]);

    // 3) onBuyProductClick (전체상품 주문, 선택 상품 주문용)
    const onBuyProductClick = useCallback((e) => {
        if (!cartFormStatus.items || cartFormStatus.items.length <= 0) return;
        const { name } = e.target;
        if (name !== 'buyall' && name !== 'buyselect') return;  
        if (name === 'buyselect' && cartFormStatus.checkedItems.length <= 0) 
            return alert('구매할 상품을 선택해주세요.');

        let value = [];
        if (name === 'buyall')
            value = cartFormStatus.items
        else if (name === 'buyselect') {                        
            cartFormStatus.checkedItems.map((v1) =>
                value.push(cartFormStatus.items.find((v2) => Number(v2.id) === Number(v1))),
            );
        } else return;

        dispatch(
            changePurchaseBuy({
                topKey: 'items',
                value,
            }),
        );
        dispatch(
            changePurchaseBuy({
                topKey: 'fromCartToBuyItems',
                value:
                    name === 'buyall'
                        ? cartFormStatus.items.map((v) => v.id)
                        : cartFormStatus.checkedItems.map((v) => v),
            }),
        );

        history.push(`/purchase/buy`);
    }, [dispatch, cartFormStatus, history]);

    // ============================================================

    return (
        <CartTemplate
            cartFormStatus={cartFormStatus}
            etcs={{ colInfo }}
            events={{ onCartChange, onItemDeleteClick, onBuyProductClick }}
            refs={{ allSelectRef }}
        />
    );
};

export default withRouter(PurchaseContainer);

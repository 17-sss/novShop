// 구매 / 장바구니 Container
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    changePurchaseCart,
    changePurchaseBuy,
    updCartVolume,
    getCart,
    initialPurchase,
    initialPurchaseForm,
    delCartGoods
} from '../../modules/purchase';
import { objectFlagIsAllReady, threeDigitsComma } from '../../lib/utility/customFunc';

import PurchaseTemplate from '../../components/purchase/PurchaseTemplate';
import { initializeUtilForm } from '../../modules/util';

const PurchaseContainer = (props) => {
    // [1] 기본 세팅
    // 1. redux 관련
    const {
        match: {
            params: { page },
        },
        history,
    } = props;    

    const dispatch = useDispatch();
    const { cartFormStatus, buyFormStatus, addressType, addressResult, userData, loading } = useSelector(
        ({ purchase, user, loading, util }) => {
            return {
                cartFormStatus: purchase.cartFormStatus,
                buyFormStatus: purchase.buyFormStatus,                
                addressType: util.addressType,
                addressResult: util.addressResult,
                userData: user.user,
                loading: loading,            
            };
        },
    );

    // 2. useState & useRef
    const [data, setData] = useState(null);
    const [priceLoading, setPriceLoading] = useState(false);
    const [curUserId, setCurUserId] = useState(-1);
    const [isUpdateValue, setIsUpdateValue] = useState(false);
    const [allLoadingOK, setAllLoadingOK] = useState(false);
    const allSelectRef = useRef(null);

    // 3. ETC
    // phoneFrontList, 구매창 연락처 앞부분 리스트(지역번호, 휴대폰 앞 번호 등) (Option 태그에 사용)
    const phoneFrontList = [            
        '010', '011', '016', '017', '018', '019',
        '02', '031', '032', '033', 
        '041', '042', '043', '044', 
        '051', '052', '053', '054', '055',
        '061', '062', '063', '064',
        '0502', '0503', '0504', '0505', '0506', '0507', '0508', '070', 
    ];
    

    // -------------------------------------------------------------------------------------------------


    // [2] 데이터 관련
    // 1. Normal & etc
    // 1) 테이블 행 정보 세팅
    const setColInfo = (page) => {
        const infoTmp = {
            value: ['이미지', '상품정보', '판매가', '수량', '적립금', '합계'],
            width: ['10', '50', '10', '10', '10', '10', '10'],
        };

        if (page === 'shoppingcart') {
            // value: ['check', '이미지', '상품정보', '판매가', '수량', '적립금', '합계'],
            infoTmp.value.unshift('check');

            // width: ['3', '10', '47', '10', '10', '10', '10', '10'],
            infoTmp.width.unshift('3');
            infoTmp.width.splice(2, 1, '47');
        }
        return infoTmp;
    };
    const colInfo = setColInfo(page);

    
    // 2. useEffect
    // +) loading 체크
    useEffect(() =>  {      
        setAllLoadingOK(false);
        const bIsOK = objectFlagIsAllReady(loading);        
        setAllLoadingOK(bIsOK);  
    }, [loading]);

    // 1-1) 초기화: 유저
    useEffect(() => {
        setCurUserId(userData && userData.data ? userData.data.id : -1);
    }, [userData]);

    // 1-2) 초기화: 페이지
    useEffect(() => {
        if (isUpdateValue) setIsUpdateValue(false);

        if ((page === 'buy' && (!buyFormStatus.items || buyFormStatus.items.length <= 0)) || page === 'shoppingcart')             
            dispatch(initialPurchase());        
            
        if (page === 'shoppingcart') setPriceLoading(false);

        if (curUserId !== -1) {
            if (page === 'shoppingcart') {
                dispatch(getCart({ userId: curUserId }));
            } else if (page === 'buy') {  
                if (!userData || typeof userData === "string" || !userData.data) return;
                const {username, address, phonenumber} = userData.data;
                
                if (username) {                                       
                    dispatch(changePurchaseBuy({topKey: "orderInfo", key: "username", subKey: '', value: username}));
                    dispatch(changePurchaseBuy({topKey: "receiveInfo", key: "username", subKey: '', value: username}));
                }
                
                if (address) {
                    const addressTemp = JSON.parse(address);                
                    for (const subKey in addressTemp) {
                        const value = addressTemp[subKey];

                        dispatch(changePurchaseBuy({topKey: "orderInfo", key: "address", subKey, value})); 
                        dispatch(changePurchaseBuy({topKey: "receiveInfo", key: "address", subKey, value}));
                    }    
                }

                if (phonenumber) {
                    const phoneTemp = JSON.parse(phonenumber);                
                    for (const subKey in phoneTemp) {
                        const value = phoneTemp[subKey];

                        dispatch(changePurchaseBuy({topKey: "orderInfo", key: "phonenumber", subKey, value})); 
                        dispatch(changePurchaseBuy({topKey: "receiveInfo", key: "phonenumber", subKey, value}));
                    }         
                }                
            } else return;
        }
    }, [dispatch, page, curUserId, isUpdateValue, userData, buyFormStatus]);

    // 2-1) 불러온 데이터 세팅
    useEffect(() => {
        if (page === 'shoppingcart') {
            if (!cartFormStatus) return;
            if (
                cartFormStatus &&
                cartFormStatus.items /*&&
                cartFormStatus.items.length > 0*/
            ) {
                return setData(cartFormStatus);
            }
        } else if (page === 'buy') {
            if (!buyFormStatus) return
            else {
                return setData(buyFormStatus);            
            }
        } else return;
    }, [cartFormStatus, buyFormStatus, page]);

    // 3) shoppingcart용 가격 계산 후 세팅 (상품구매금액, 배송비, 총금액)
    useEffect(() => {
        if (priceLoading) return;
        if (page !== 'shoppingcart') return;
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
    }, [priceLoading, cartFormStatus, page, dispatch]);

    // 4) 장바구니 상품들의 체크박스에 따른 전체선택 체크박스 제어    
    useEffect(() => {        
        if (page !== 'shoppingcart' || !cartFormStatus) return;
        if (cartFormStatus.items && cartFormStatus.items.length <= 0) return;
        if (!allSelectRef.current) return;

        const { items, checkedItems } = cartFormStatus;

        if (!items || !checkedItems) return;
        if (!items instanceof Array || !checkedItems instanceof Array) return;        
                    
        if (cartFormStatus.checkedItems.length === cartFormStatus.items.length) 
            allSelectRef.current.checked = true
        else
            allSelectRef.current.checked = false;               
    }, [cartFormStatus, page]);

    // 5) 주소 API 관련 값 Change   (구매창 전용)
    useEffect(() => {
        if (addressType !== "order" && addressType !== "receive") return;        
        const { zonecode, address, buildingName, bname, } = addressResult;
        if (!zonecode && !address && !buildingName && !bname) return;

        const setExtraAddress = (aBuildingName, aBname) => {
            let result = '';
            if (aBname) 
                result += aBname;
            if (aBuildingName) {
                result += 
                    result !== ''
                    ? `, ${aBuildingName}`
                    : aBuildingName;
            }
            if(result) result = `(${result})`;

            return result;
        };
        const extraAddress = setExtraAddress(buildingName, bname);        
        
        dispatch(changePurchaseBuy({
            topKey: addressType + 'Info',
            key: 'address',
            subKey: 'addressPostNo',
            value: zonecode,
        }));

        dispatch(changePurchaseBuy({
            topKey: addressType + 'Info',
            key: 'address',
            subKey: 'addressAddr1',
            value: address,
        }));

        if (extraAddress) {
            dispatch(changePurchaseBuy({
                topKey: addressType + 'Info',
                key: 'address',
                subKey: 'addressAddr2',
                value: extraAddress,
            }));
        }        
        dispatch(initializeUtilForm({form: 'addressResult'}));
    }, [dispatch, addressResult, addressType]);


    // -------------------------------------------------------------------------------------------------


    // 3. 이벤트
    // 1) onCartChange, 장바구니 창 전용
    const onCartChange = useCallback(
        (e) => {
            if (page !== 'shoppingcart') return;
            const { id, name: key, checked } = e.target;
            let { value } = e.target;
            const form = 'cartFormStatus';                        

            let changePurchaseCartParams = { form, key, value };

            if (form === 'cartFormStatus') {
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
                changePurchaseCartParams = {
                    form,
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
                };
            }

            dispatch(changePurchaseCart(changePurchaseCartParams));

            if (form === 'cartFormStatus' && key === 'volume') {
                dispatch(updCartVolume({ id, volume: value }));
                setPriceLoading(false);
            }
        },
        [dispatch, page],
    );

    // 2) onBuyChange, 구매 창 전용 (구매 창의 주문자, 받는사람 정보 등)
    const onBuyChange = useCallback((e) => {
        if (page !== 'buy') return;        
        const { name, value, } = e.target;                        
        const topKey =
            (name.indexOf('receive') > -1) || (name === "deliveryMessage")
                ? 'receiveInfo'
                : name.indexOf('order') > -1
                ? 'orderInfo'
                : '';
        if(!topKey) return;

        let key = name.replace(
                topKey === 'receiveInfo' ? 'receive' : 'order',
                '',
            );
        if (!key) return;        
        let subKey = '';

        if (key === "UserName") key = key.toLowerCase()
        else if (key === "AddressAddr2") {
            key = "address";
            subKey = "addressAddr2";
        } else if (key.toLowerCase().indexOf('phone') > -1) {                        
            switch (key) {
                case "PhoneNumSelect": {
                    subKey = 'phoneNumSelect';
                    break;
                }                    
                case "PhoneNum1": {
                    subKey = 'phoneNum1';
                    break;
                }
                case "PhoneNum2": {
                    subKey = 'phoneNum2';
                    break;
                }
                default:
                    break;
            }
            key = 'phonenumber';
        }
        
        dispatch(
            changePurchaseBuy({
                topKey,
                key: name === 'deliveryMessage' ? name : key,
                subKey,
                value,
            }),
        );
    }, [dispatch, page]);
    

    // 3) onItemDeleteClick (선택 상품 삭제, 장바구니 비우기)
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

    // 4) onBuyProductClick (장바구니 창 전용. 전체상품 주문, 선택 상품 주문용)
    const onBuyProductClick = useCallback((e) => {
        if (!cartFormStatus.items || cartFormStatus.items.length <= 0) return;
        const { name } = e.target;
        if (name !== 'buyall' && name !== 'buyselect') return;  
        if (name === 'buyselect' && cartFormStatus.checkedItems.length <= 0) return alert('제품을 선택해주세요.');

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

        history.push(`/purchase/buy`);  // 제대로 안먹힘.. 분리해야하나? 장바구니랑 구매랑?
    }, [dispatch, cartFormStatus, history]);

    // 5) onAddressInfoControl, onClick (배송 정보에 주문 정보 그대로 가져오거나, 각 정보란 초기화 Btn Click)
    const onAddressInfoControl = useCallback((e) => {
        const { name } = e.target;

        
        if (name.indexOf('Clean') > -1) {                   // 초기화 (주문정보 & 배송정보)
            const subForm = name.replace("Clean", "");
            dispatch(initialPurchaseForm({form: "buyFormStatus", subForm, }))                
        } else if (name === "orderReceiveSame") {           // 주문정보와 같음
            if (!buyFormStatus || !buyFormStatus.orderInfo) return;

            for (const key in buyFormStatus.orderInfo) {                
                if (key === "username") {
                    const value = buyFormStatus.orderInfo[key];
                    dispatch(changePurchaseBuy({topKey: "receiveInfo", key, subKey: '', value}));
                } else if (key === "address" || key === "phonenumber") {
                    for (const subKey in buyFormStatus.orderInfo[key]) {                        
                        const value = buyFormStatus.orderInfo[key][subKey];
                        dispatch(changePurchaseBuy({topKey: "receiveInfo", key, subKey, value}));
                    }
                } else continue;
            }
        } else return;

    }, [dispatch, buyFormStatus]);

    // ============================================================

    const returnJSX = (
        <PurchaseTemplate
            data={data}
            etcs={{ page, colInfo, phoneFrontList }}
            events={{ onCartChange, onBuyChange, onItemDeleteClick, onBuyProductClick, onAddressInfoControl }}
            refs={{ allSelectRef }}
        />
    );

    return page === "buy" ? allLoadingOK && returnJSX : returnJSX;
};

export default withRouter(PurchaseContainer);

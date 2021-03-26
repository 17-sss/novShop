// 구매 / 장바구니 Container
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    buyIn,
    changePurchaseBuy,
    initialPurchase,
    initialPurchaseForm,
    delCartGoods,
} from '../../modules/purchase';
import {  threeDigitsComma } from '../../lib/utility/customFunc';

import BuyTemplate from '../../components/purchase/BuyTemplate';
import { initializeUtilForm } from '../../modules/util';

const BuyContainer = (props) => {
    // [1] 기본 세팅
    // 1. redux 관련
    const {history} = props;    

    const dispatch = useDispatch();
    const {buy, buyFormStatus, addressType, addressResult, userData } = useSelector(
        ({ purchase, user, util }) => {
            return {                
                buy: purchase.buy,
                buyFormStatus: purchase.buyFormStatus,
                addressType: util.addressType,
                addressResult: util.addressResult,
                userData: user.user,         
            };
        },
    );

    // 2. useState & useRef    
    const [priceLoading, setPriceLoading] = useState(false);    
    const [isUpdateValue, setIsUpdateValue] = useState(false);  
    const isEmptyItems = useRef(null);
    
    // 3. ETC
    // 1) 테이블 행 정보 세팅
    const colInfo = {
        value: ['이미지', '상품정보', '판매가', '수량', '적립금', '합계'],
        width: ['10', '50', '10', '10', '10', '10', '10'],
    };
    
    // 2) 구매창 연락처 앞부분 리스트(지역번호, 휴대폰 앞 번호 등) (Option 태그에 사용)
    const phoneFrontList = [            
        '010', '011', '016', '017', '018', '019',
        '02', '031', '032', '033', 
        '041', '042', '043', '044', 
        '051', '052', '053', '054', '055',
        '061', '062', '063', '064',
        '0502', '0503', '0504', '0505', '0506', '0507', '0508', '070', 
    ];

    // -------------------------------------------------------------------------------------------------


    // [2] hooks
    // 1. useEffect

    // 1) 초기화: 페이지
    useEffect(() => {
        if (buyFormStatus.items && buyFormStatus.items.length > 0)
            isEmptyItems.current = false
        else 
            isEmptyItems.current = true;
    });

    useEffect(() => {
        if (isUpdateValue) setIsUpdateValue(false);
        if (isEmptyItems.current) {
            dispatch(initialPurchase());
            isEmptyItems.current = false;
        };        
        setPriceLoading(false);

        // 새로고침하면 정보 사라져서 localStorage 활용 START ----
        const tempItems = localStorage.getItem('buyFormStatusItems');
        if (tempItems) {                                    
            dispatch(
                changePurchaseBuy({
                    topKey: 'items',
                    value: JSON.parse(tempItems),
                }),
            );
        };

        const tempFromCartToBuyItems = localStorage.getItem('fromCartToBuyItems');
        if (tempFromCartToBuyItems) {
            dispatch(
                changePurchaseBuy({
                    topKey: 'fromCartToBuyItems',
                    value: JSON.parse(tempFromCartToBuyItems),
                }),
            );
        }
        // 새로고침하면 정보 사라져서 localStorage 활용 END ----

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
    }, [dispatch, isUpdateValue, userData, ]);

    // 2) 현재 목록 가격 계산 후 세팅 (상품구매금액, 배송비, 총금액)
    useEffect(() => {
        if (priceLoading) return;
        if (
            buyFormStatus &&
            buyFormStatus.items &&
            buyFormStatus.items.length > 0
        ) {
            const onePriceResult = () => {
                const {
                    product: { price, sale },
                    volume,
                } = buyFormStatus.items[0];
                
                const result =
                    sale > 0 && sale < 1
                        ? (price - price * sale) * volume
                        : price * volume;
                
                return result;
            }

            const allProductPriceTmp =
                buyFormStatus.items.length > 1
                    ? buyFormStatus.items.reduce((prev, curr) => {
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
                    : buyFormStatus.items.length === 1 && onePriceResult();

            const shippingFeeTmp = allProductPriceTmp >= 30000 ? '무료' : 2500;
            const totalPriceTmp =
                shippingFeeTmp === '무료'
                    ? allProductPriceTmp
                    : allProductPriceTmp + shippingFeeTmp;

            dispatch(
                changePurchaseBuy({
                    topKey: 'allProductPrice',                    
                    value: threeDigitsComma(allProductPriceTmp),
                }),
            );
            dispatch(
                changePurchaseBuy({                    
                    topKey: 'shippingFee',
                    value:
                        shippingFeeTmp === '무료'
                            ? shippingFeeTmp
                            : threeDigitsComma(shippingFeeTmp),
                }),
            );
            dispatch(
                changePurchaseBuy({                    
                    topKey: 'totalPrice',
                    value: threeDigitsComma(totalPriceTmp),
                }),
            );

            const { allProductPrice, shippingFee, totalPrice } = buyFormStatus;
            if (!allProductPrice || !shippingFee || !totalPrice)
                setPriceLoading(false);
            else setPriceLoading(true);
        }
    }, [priceLoading, buyFormStatus, dispatch]);

    // 3) 주소 API 관련 값 Change 
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

    // 4) onBuySubmit 이벤트가 성공했을시 buy 상태 체크 후 페이지 이동
    useEffect(() => {        
        if (!buy) return;
        const { data, success } = buy;

        if (data === 'buyInOK' && success) {
            dispatch(initialPurchaseForm({form: "buy", subForm: ""}));
            history.push(`/purchase/buyConfirm`);
        }
    }, [dispatch, buy, history]);


    // -------------------------------------------------------------------------------------------------


    // 3. 이벤트
    // 1) onBuyChange, 구매 창 전용 (구매 창의 주문자, 받는사람 정보 등)
    const onBuyChange = useCallback((e) => {        
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
    }, [dispatch]);

    // 2) onAddressInfoControl, onClick (배송 정보에 주문 정보 그대로 가져오거나, 각 정보란 초기화 Btn Click)
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

    // 3) onBuySubmit, onClick (서버로 구매리스트 및 정보 전송)
    const onBuySubmit = useCallback( async () => {
        if (!userData || typeof userData === "string" || !userData.data) return;
        const { id } = userData.data;
        const {
            orderInfo,
            receiveInfo,
            items,
            allProductPrice,
            shippingFee,
            totalPrice,
            fromCartToBuyItems,
        } = buyFormStatus;
        
        dispatch(
            buyIn({
                orderInfo,
                receiveInfo,
                items,
                allProductPrice: allProductPrice.replace(',', ''),
                shippingFee: shippingFee !== "무료" ? shippingFee.replace(',', '') : 0,
                totalPrice: totalPrice.replace(',', ''),
                userId: id,
            }),
        );
        dispatch(delCartGoods({ items: fromCartToBuyItems }));

        if (localStorage.getItem('buyFormStatusItems')) 
            localStorage.removeItem('buyFormStatusItems');
        if (localStorage.getItem('fromCartToBuyItems')) 
            localStorage.removeItem('fromCartToBuyItems');
    }, [buyFormStatus, userData, dispatch]);


    // ============================================================
    return (
        <BuyTemplate
            buyFormStatus={buyFormStatus}
            etcs={{ colInfo, phoneFrontList }}
            events={{ onBuyChange, onAddressInfoControl, onBuySubmit }}            
        />
    )
};

export default withRouter(BuyContainer);

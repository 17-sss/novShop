// ShoppingCart & Buy
import { createAction, handleActions } from 'redux-actions';
import { takeLatest } from 'redux-saga/effects';
import { createRequestActionTypes, createRequestSaga } from '../lib/reduxUtil';
import * as purchaseAPI from '../lib/api/purchase';

// 리덕스에 등록 안함, api 만들어야함.
// 액션 이름 정의 ----
const INITALIZE_PURCHASE = 'purchase/INITALIZE_PURCHASE';
const CHANGE_PURCHASE = 'purchase/CHANGE_PURCHASE'; 

const [CART_IN, CART_IN_SUCCESS, CART_IN_FAILURE] = createRequestActionTypes(
    'purchase/CART_IN',
);
const [GET_CART, GET_CART_SUCCESS, GET_CART_FAILURE] = createRequestActionTypes(
    'purchase/GET_CART',
);
const [
    UPD_CART_VOLUME,
    UPD_CART_VOLUME_SUCCESS,
    UPD_CART_VOLUME_FAILURE,
] = createRequestActionTypes('purchase/UPD_CART_VOLUME');
const [
    DEL_CART_GOODS,
    DEL_CART_GOODS_SUCCESS,
    DEL_CART_GOODS_FAILURE,
] = createRequestActionTypes('purchase/DEL_CART_GOODS');


// =======================================================================

// 액션 생성 함수 작성
export const initialPurchase = createAction(INITALIZE_PURCHASE);
export const changePurchase = createAction(
    CHANGE_PURCHASE,
    ({ form, key, value, addValue } = { addValue: null }) => ({
        form,
        key,
        value,
        addValue,
    }),
);
export const cartIn = createAction(
    CART_IN,
    ({ volume, selcolor, selsize, productId, userId }) => ({
        volume,
        selcolor,
        selsize,
        productId,
        userId,
    }),
);
export const getCart = createAction(GET_CART, ({ userId }) => ({ userId }));
export const updCartVolume = createAction(
    UPD_CART_VOLUME,
    ({ id, volume }) => ({ id, volume }),
);
export const delCartGoods = createAction(
    DEL_CART_GOODS,
    ({ items }) => ({ items }),
);
// =======================================================================

// 사가 생성
const cartInSaga = createRequestSaga(CART_IN, purchaseAPI.cartIn);
const getCartSaga = createRequestSaga(GET_CART, purchaseAPI.getCart);
const updCartVolumeSaga = createRequestSaga(UPD_CART_VOLUME, purchaseAPI.updCartVolume);
const delCartGoodsSaga = createRequestSaga(DEL_CART_GOODS, purchaseAPI.delCartGoods);

export function* purchaseSaga() {
    yield takeLatest(CART_IN, cartInSaga);
    yield takeLatest(GET_CART, getCartSaga);
    yield takeLatest(UPD_CART_VOLUME, updCartVolumeSaga);
    yield takeLatest(DEL_CART_GOODS, delCartGoodsSaga);
}
// =======================================================================

// 리듀서 초기값
const initialState = {
/* 
    - 지금까지 내가 리덕스 모듈을 만들때 ~form + ~status 느낌)
        1) buyFormStatus: 구매 상태를 담당 
        2) cartFormStatus: 장바구니 상태를 담당
*/
    buy: null,
    buyFormStatus: {
        items: null,
        // 추후 수정 (필요한 값 등록하기 cartFormStatus 처럼)
    },
    cart: null,
    cartFormStatus: {
        items: null,
        checkedItems: [],
        allProductPrice: "",     // 상품구매금액
        shippingFee: "",         // 배송비
        totalPrice: "",          // 상품구매금액 + 배송비
    },
    
    purchaseError: null,
};
// =======================================================================

// purchase 리듀서용 함수들 (SUCCESS or FAILURE)
// 1) okNotokFuncCart, for Cart
const okNotokFuncCart = (type, status) => {
    
    const successFunc = (state, action) => {
        const { payload } = action;

        return {
            ...state,
            cart: type !== "cartFormStatus" ? payload : state['cart'],
            cartFormStatus: type === "cartFormStatus" ?  payload : state['cartFormStatus'],
            purchaseError: null,
        };
    }

    const failureFunc = (state, action) => {
        const { payload: purchaseError } = action;
    
        return {
            ...state,
            cart: type !== "cartFormStatus" ? null : state['cart'],
            cartFormStatus: type === "cartFormStatus" ?  null : state['cartFormStatus'],            
            purchaseError,
        };
    };
    
    return (status === 'failure' ? failureFunc : successFunc);
}   

// 리듀서
const purchase = handleActions(
    {
        // 초기화
        [INITALIZE_PURCHASE]: (state) => {
            return {
                ...state,
                buy: null,
                buyFormStatus: initialState["buyFormStatus"],
                cart: null,
                cartFormStatus: initialState["cartFormStatus"],                
                purchaseError: null,
            };
        },

        // onChange
        [CHANGE_PURCHASE]: (state, action) => {
            const { payload } = action;
            const { form, addValue } = payload;
            let { key, value } = payload;            

            let keyBak = '';
            if (form === 'cartFormStatus') {
                if (key === 'volume' || key === 'select' || key === 'allselect') {
                    keyBak = key;

                    if (key === 'select' || key === 'allselect') 
                        key = 'checkedItems'
                    else if (key === 'volume')
                        key = 'items';        

                    if (keyBak === 'volume') {          // volume의 경우만 여기서 처리                 
                        const items = state[form][key];     // state[cartFormStatus][items]
                        let item = items.find((v) => v.id === addValue);
                        let itemIndex = items.findIndex((v) => v.id === addValue);

                        if ('volume' in item) {                    
                            item['volume'] = Number(value);
                            items.splice(itemIndex, 1, item);
                            value = items;                    
                        } else  return;
                    }                    
                }                   
            }

            return {
                ...state,
                [form]: {
                    ...state[form],
                    [key]:
                        form === 'cartFormStatus' && key === 'checkedItems'
                            ? keyBak === 'select'
                                ? addValue
                                    ? state[form][key].concat(Number(value))
                                    : state[form][key].filter(
                                          (v) => v !== Number(value),
                                      )
                                : keyBak === 'allselect'
                                ? Boolean(value)
                                    ? // 이리하니까 checkedItems에 장바구니 아이템 고유 id 잘들감..
                                      state['cartFormStatus']['items'].map((v) => v.id,)
                                    /*  
                                        // [ERR!!] 이리하면 전부선택  [[id], [id]] 요론식으로 들감..
                                        state['cartFormStatus']['items'].map((v, i) => {                                            
                                            if (state[form][key].indexOf(v.id) <= -1)
                                                return state[form][key].concat(Number(v.id))
                                            else 
                                                return state[form][key];                                                                                        
                                        })
                                    */
                                    : []
                                : value
                            : value,
                },
            };
        },

        // 장바구니 담기
        [CART_IN_SUCCESS]: (state, action) => {
            const { payload: cart } = action;

            return {
                ...state,
                cart,
                purchaseError: null,
            };
        },
        [CART_IN_FAILURE]: (state, action) => {
            const { payload: purchaseError } = action;

            return {
                ...state,
                cart: null,
                purchaseError,
            };
        },

        // 장바구니 정보 가져오기
        [GET_CART_SUCCESS]: (state, action) => {
            const { payload: {data: items} } = action;

            return {
                ...state,
                cartFormStatus: {
                    ...state["cartFormStatus"],
                    items,
                },
                purchaseError: null,
            };
        },
        [GET_CART_FAILURE]: (state, action) => {
            const { payload: purchaseError } = action;

            return {
                ...state,
                cartFormStatus: initialState["cartFormStatus"],
                purchaseError,
            };
        },

        // 수량 업데이트 (불러온 데이터 기반) 
            // (추후 수량 자체는.. 음 쿠키에 넣어둬야하나 세션에 넣을까.. 수량 변경될때마다 DB변경되는건 너무.. ㅠ)
        [UPD_CART_VOLUME_SUCCESS]: okNotokFuncCart("cart", "success"),
        [UPD_CART_VOLUME_FAILURE]: okNotokFuncCart("cart", "failure"),

        // 선택 상품 삭제 or 장바구니 비우기
        [DEL_CART_GOODS_SUCCESS]: okNotokFuncCart("cart", "success"),
        [DEL_CART_GOODS_FAILURE]: okNotokFuncCart("cart", "failure"),

    },
    initialState,
);

export default purchase;

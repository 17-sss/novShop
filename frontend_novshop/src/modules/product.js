import { createAction, handleActions } from 'redux-actions';
import { takeLatest } from 'redux-saga/effects';
import { createRequestActionTypes, createRequestSaga } from '../lib/reduxUtil';
import * as productAPI from '../lib/api/product';
import { replaceAll, isEmpty } from '../lib/utility/customFunc';

// 액션 이름 정의
const INITALIZE_PRODUCT = 'product/INITALIZE_PRODUCT';
const INITALIZE_PRODUCT_KEY = 'product/INITALIZE_PRODUCT_KEY';
const INITALIZE_PRODUCT_FORM = 'product/INITALIZE_PRODUCT_FORM';

const CHANGE_PRODUCT_FORMS = 'product/CHANGE_PRODUCT_FORMS';
const DEL_ITEM_PRODUCT_FORM = 'product/DEL_ITEM_PRODUCT_FORM';
const ADD_SELECT_PRODUCT = 'product/ADD_SELECT_PRODUCT';
const DEL_SELECT_PRODUCT = 'product/DEL_SELECT_PRODUCT';

const [
    CREATE_PRODUCT,
    CREATE_PRODUCT_SUCCESS,
    CREATE_PRODUCT_FAILURE,
] = createRequestActionTypes('product/CREATE_PRODUCT');

const [
    GET_ALL_PRODUCT,
    GET_ALL_PRODUCT_SUCCESS,
    GET_ALL_PRODUCT_FAILURE,
] = createRequestActionTypes('product/GET_ALL_PRODUCT');

const [
    GET_PRODUCT,
    GET_PRODUCT_SUCCESS,
    GET_PRODUCT_FAILURE,
] = createRequestActionTypes('product/GET_PRODUCT');

// Admin ---- START
const [
    ADMIN_GET_PRODUCT,
    ADMIN_GET_PRODUCT_SUCCESS,
    ADMIN_GET_PRODUCT_FAILURE,
] = createRequestActionTypes('product/ADMIN_GET_PRODUCT');

const [
    ADMIN_UPD_PRODUCT,
    ADMIN_UPD_PRODUCT_SUCCESS,
    ADMIN_UPD_PRODUCT_FAILURE,
] = createRequestActionTypes('product/ADMIN_UPD_PRODUCT');

const [
    ADMIN_DEL_PRODUCT,
    ADMIN_DEL_PRODUCT_SUCCESS,
    ADMIN_DEL_PRODUCT_FAILURE,
] = createRequestActionTypes('product/ADMIN_DEL_PRODUCT');
// Admin ---- END

// =======================================================================

// 액션 생성 함수 작성
export const changeProductForms = createAction(
    CHANGE_PRODUCT_FORMS,
    ({ form, key, value, opt }) => ({ form, key, value, opt }),
);

export const delItemProductForm = createAction(
    DEL_ITEM_PRODUCT_FORM,
    ({ key, vKey, vValue }) => ({ key, vKey, vValue }),
);

export const initializeProduct = createAction(INITALIZE_PRODUCT);
export const initializeProductKey = createAction(
    INITALIZE_PRODUCT_KEY,
    ({ form, key, updValue } = {updValue: null}) => ({ form, key, updValue }),
);
export const initializeProductForm = createAction(
    INITALIZE_PRODUCT_FORM,
    ({ form, updForm } = { updForm: null }) => ({ form, updForm }),
);

export const createProduct = createAction(
    CREATE_PRODUCT,
    ({
        name,
        image,
        sizes,
        colors,
        price,
        sale,
        description,
        detailinfo,
        categorySub,
        categoryId,
    }) => ({
        name,
        image,
        sizes,
        colors,
        price,
        sale: (sale * 0.01),
        description,
        detailinfo,
        categorySub,
        categoryId,
    }),
);
export const getAllProduct = createAction(
    GET_ALL_PRODUCT,
    ({ categoryId, categorySub }) => ({ categoryId, categorySub }),
);
export const getProduct = createAction(
    GET_PRODUCT,
    ({ categoryId, categorySub, id }) => ({ categoryId, categorySub, id }),
);
// Admin ---- START
export const adminGetProduct = createAction(
    ADMIN_GET_PRODUCT,
    ({id}) => ({id}),
);

export const adminUpdProduct = createAction(
    ADMIN_UPD_PRODUCT,
    ({
        name,
        image,
        sizes,
        colors,
        price,
        sale,
        description,
        detailinfo,
        categorySub,
        categoryId,

        id,
    }) => ({
        name,
        image,
        sizes,
        colors,
        price,
        sale: (sale * 0.01),
        description,
        detailinfo,
        categorySub,
        categoryId,
        
        id,
    }),
);

export const adminDelProduct = createAction(
    ADMIN_DEL_PRODUCT,
    ({id}) => ({id}),
);
// Admin ---- END

// 상품 상세 페이지에서 구매하려는 상품을 선택했을 시, 리스트 IN
export const addSelectProduct = createAction(
    ADD_SELECT_PRODUCT,
    ({ id, name, sizeinfo, size, color, volume, price, mileage, productId }) => ({
        id,
        name,
        sizeinfo,
        size,
        color,
        volume,
        price,
        mileage,
        productId,
    }),
);
// 상품 상세 페이지에서 구매하려했던 리스트에서 X버튼을 누르면, 리스트 OUT
export const delSelectProduct = createAction(DEL_SELECT_PRODUCT, ({ id }) => ({
    id,
}));

// =======================================================================

// 사가 생성
const createProductSaga = createRequestSaga(
    CREATE_PRODUCT,
    productAPI.createProduct,
);

const getAllProductSaga = createRequestSaga(
    GET_ALL_PRODUCT,
    productAPI.getAllProduct,
);

const getProductSaga = createRequestSaga(GET_PRODUCT, productAPI.getProduct);

const adminGetProductSaga = createRequestSaga(ADMIN_GET_PRODUCT, productAPI.adminGetProduct);
const adminUpdProductSaga = createRequestSaga(ADMIN_UPD_PRODUCT, productAPI.adminUpdProduct);
const adminDelProductSaga = createRequestSaga(ADMIN_DEL_PRODUCT, productAPI.adminDelProduct);

export function* productSaga() {
    yield takeLatest(CREATE_PRODUCT, createProductSaga);
    yield takeLatest(GET_ALL_PRODUCT, getAllProductSaga);
    yield takeLatest(GET_PRODUCT, getProductSaga);
    yield takeLatest(ADMIN_GET_PRODUCT, adminGetProductSaga);
    yield takeLatest(ADMIN_UPD_PRODUCT, adminUpdProductSaga);
    yield takeLatest(ADMIN_DEL_PRODUCT, adminDelProductSaga);
}
// =======================================================================

// 리듀서 초기값
const initialState = {
    // 상품 생성용 폼
    productForm: {
        name: '',
        image: '',
        size: '',
        sizes: [],
        color: '#000000',
        colorName: '',
        colors: [],
        price: 1000,
        sale: 0,
        description: '',
        detailinfo: '',
        categorySub: 0,
        categoryId: 0,
    },
    // 상품 (생성, 수정, 삭제) 서버에서 값 반환용
    product: null,
    // 상품 상세 페이지 - 옵션 선택한 상태 저장용
    productSelectItems: {
        items: [],
        totalprice: 0,
    },
    // 상품 View (전체 or 개별)
    productStatus: null,
    // 에러 표시
    productError: null,
};
// =======================================================================

// product 리듀서용 함수 (SUCCESS or FAILURE) 
const okNotokFunc = (type, status) => {
    const successFunc = (state, action) => {
        const { payload } = action;

        return {
            ...state,
            product: type !== "productStatus" ? payload : state['product'],
            productStatus: type === "productStatus" ?  payload : state['productStatus'],
            productError: null,
        };
    }

    const failureFunc = (state, action) => {
        const { payload: productError } = action;
    
        return {
            ...state,
            product: type !== "productStatus" ? null : state['product'],
            productStatus: type === "productStatus" ?  null : state['productStatus'],            
            productError,
        };
    };
    
    return (status === 'failure' ? failureFunc : successFunc);
}   

// 리듀서
const product = handleActions(
    {
        // 초기화
        [INITALIZE_PRODUCT]: (state) => {
            return {
                ...state,
                productForm: initialState['productForm'],
                product: null,
                productSelectItems: initialState['productSelectItems'],
                productStatus: null,
                productError: null,
            };
        },
        // 특정 키 초기화
        [INITALIZE_PRODUCT_KEY]: (state, action) => {
            const { payload } = action;
            const { form, key, updValue } = payload;            
            return {
                ...state,
                [form]: {
                    ...state[form],
                    [key]: updValue ? updValue : initialState[form][key],
                },
            };
        },
        // 특정 폼 초기화 (form: 'productForm' OR 'productSelectItems')
        [INITALIZE_PRODUCT_FORM]: (state, action) => {
            const { payload } = action;
            const { form, updForm } = payload;            
            return {
                ...state,
                [form]: (updForm && !isEmpty(updForm)) ? updForm : initialState[form],
            };
        },

        // 상품 폼 ONCHANGE (form: 'productForm' OR 'productSelectItems')
        [CHANGE_PRODUCT_FORMS]: (state, action) => {
            const { payload } = action;
            const { productForm, productSelectItems, productStatus } = state;

            const { form } = payload;
            let { key, value, opt } = payload;
            let arrTmp = [];

            if (form === 'productForm') {
                switch (key) {
                    case 'price':
                    case 'sale':
                    case 'categorySub':
                    case 'categoryId': {
                        value = Number(value);                        
                        break;
                    }
                    case 'insertColors':
                    case 'insertSizes': {
                        const {
                            size,
                            sizes,
                            color,
                            colorName,
                            colors,
                        } = productForm;
                        key = replaceAll(key, 'insert', '').toLowerCase();

                        if (key === 'sizes') {
                            if (sizes.indexOf(size) > -1 || size === '')
                                arrTmp = sizes;
                            else arrTmp = sizes.concat(size);
                        } else {
                            if (colors.find((aObj) => aObj.key === color)) {
                                arrTmp = colors;
                            } else {
                                arrTmp = colors.concat({
                                    key: color,
                                    value: colorName,
                                });
                            }
                        }
                        break;
                    }
                    default:
                        break;
                }
            } else if (form === 'productSelectItems') {
                const { items } = productSelectItems;
                const { mileage } = productStatus && productStatus.data;
                const { inputName, id } = opt;

                switch (key) {
                    case 'items': {
                        if (!productStatus || items.length <= 0) return;
                        const index = items.findIndex(
                            (v) => v.id === Number(id),
                        );
                        let objTmp = items[index];

                        const { price, sale } = productStatus.data; // price는 productStatus에서 가져와야함!    productSelectItems에서 가져오면 꼬일듯.

                        if (inputName === 'volume') {
                            value = Number(value);
                            objTmp = {
                                ...objTmp,
                                [inputName]: value,
                                price:
                                    sale > 0 && sale < 1
                                        ? Math.round(Number(price) -
                                              Number(price) * Number(sale)) * value
                                        : Math.round(Number(price) * value),
                                mileage: mileage * value,
                            };
                            
                            arrTmp = items;
                            arrTmp.splice(index, 1, objTmp);
                        }
                        break;
                    }
                    default:
                        break;
                }
            }

            let returnObj = {
                ...state[form],
                [key]:
                    form === 'productForm'
                        ? key === 'sizes' || key === 'colors'
                            ? arrTmp
                            : value
                        : key === 'items'
                        ? arrTmp
                        : value,
            };

            if (form === 'productSelectItems') {
                // form이 productSelectItems 경우 totalprice 속성 계산
                let arrPrice = [];
                arrTmp.length > 0 &&
                    arrTmp.map((v) => {
                        let price = v.price;
                        return arrPrice.push(price);
                    });
                let totalprice = arrPrice.reduce((acc, cur, i) => acc + cur);

                returnObj = {
                    ...returnObj,
                    totalprice,
                };
            }            

            return {
                ...state,
                [form]: returnObj,
            };
        },

        // 상품 생성 폼에서 이미 정의해놓은 색상, 사이즈 정보 선택적 제거
        [DEL_ITEM_PRODUCT_FORM]: (state, action) => {
            const { colors, sizes } = state.productForm;
            const { payload } = action;
            const { key, vKey, vValue } = payload;
            
            return {
                ...state,
                productForm: {
                    ...state['productForm'],
                    [key]:
                        key === 'colors'
                            ? colors.filter(
                                  (aObj) =>
                                      aObj.key !== vKey &&
                                      aObj.value !== vValue,
                              )
                            : sizes.filter((aitem) => (aitem !== vKey) ),
                },
            };
        },

        // 상품 생성
        [CREATE_PRODUCT_SUCCESS]: okNotokFunc("product", "success"),
        [CREATE_PRODUCT_FAILURE]: okNotokFunc("product", "failure"),

        // 상품 전체 불러오기
        [GET_ALL_PRODUCT_SUCCESS]: okNotokFunc("productStatus", "success"),
        [GET_ALL_PRODUCT_FAILURE]: okNotokFunc("productStatus", "failure"),
        
        // 특정 상품 상세정보 불러오기
        [GET_PRODUCT_SUCCESS]: okNotokFunc("productStatus", "success"),
        [GET_PRODUCT_FAILURE]: okNotokFunc("productStatus", "failure"),

        // Admin ---- START
        // 상품 정보 불러오기 (Admin) (product개체에 불러와서 productForm에 적용하기)
        [ADMIN_GET_PRODUCT_SUCCESS]: okNotokFunc("product", "success"),
        [ADMIN_GET_PRODUCT_FAILURE]: okNotokFunc("product", "failure"),
        
        // 상품 정보 수정
        [ADMIN_UPD_PRODUCT_SUCCESS]: okNotokFunc("product", "success"),
        [ADMIN_UPD_PRODUCT_FAILURE]: okNotokFunc("product", "failure"),
        
        // 상품 삭제 (Admin)
        [ADMIN_DEL_PRODUCT_SUCCESS]: (state, action) => {
            const { payload: product } = action;

            return {
                ...state,
                product,
                productError: null,
            }
        },
        [ADMIN_DEL_PRODUCT_FAILURE]: (state, action) => {
            const { payload: productError } = action;

            return {
                ...state,
                product: null,
                productError,
            }
        },
        // Admin ---- END

        // 상품 상세 - 옵션 선택한 상태 저장
        [ADD_SELECT_PRODUCT]: (state, action) => {
            const { items, totalprice } = state.productSelectItems;
            const { payload } = action;
            const {
                id,
                name,
                sizeinfo,
                size,
                color,
                volume,
                price,
                mileage,
                productId,
            } = payload;

            let tmpTotalprice = totalprice + price;

            return {
                ...state,
                productSelectItems: {
                    ...state['productSelectItems'],
                    items: items.concat({
                        id,
                        name,
                        sizeinfo,
                        size,
                        color,
                        volume,
                        price,
                        mileage,
                        productId,
                    }),
                    totalprice: tmpTotalprice,
                },
            };
        },

        // 상품 상세 - 현재 선택 목록 중 제거버튼 누른 항목 제거
        [DEL_SELECT_PRODUCT]: (state, action) => {
            const { items, totalprice } = state.productSelectItems;
            const { id } = action.payload;
            const index = items.findIndex((v) => v.id === Number(id));

            let price = items[index].price;
            let tmpTotalprice = totalprice - price;

            /*
                let arrTmp = items;
                arrTmp.splice(id, 1);
                // filter 사용하여 해결함. 위 방법은 (임시 값 만들어 리턴에 대입) 
                // 계속 의문이 듬.. 리액트인데 음? 이런 느낌
            */

            return {
                ...state,
                productSelectItems: {
                    ...state['productSelectItems'],
                    items: items.filter((v) => v.id !== Number(id)),
                    totalprice: tmpTotalprice,
                },
            };
        },
    },
    initialState,
);

export default product;

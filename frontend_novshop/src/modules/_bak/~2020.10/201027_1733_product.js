import { createAction, handleActions } from 'redux-actions';
import { takeLatest } from 'redux-saga/effects';
import { createRequestActionTypes, createRequestSaga } from '../lib/reduxUtil';
import * as productAPI from '../lib/api/product';
import { replaceAll } from '../lib/utility/customFunc';

// 액션 이름 정의
const INITALIZE_PRODUCT = 'product/INITALIZE_PRODUCT';
const INITALIZE_PRODUCT_KEY = 'product/INITALIZE_PRODUCT_KEY';
const INITALIZE_PRODUCT_FORM = 'product/INITALIZE_PRODUCT_FORM';

const CHANGE_PRODUCT_FORMS = 'product/CHANGE_PRODUCT_FORMS';
const ADD_SELECT_PRODUCT = 'product/ADD_SELECT_PRODUCT';

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

// =======================================================================

// 액션 생성 함수 작성
export const changeProductForms = createAction(
    CHANGE_PRODUCT_FORMS,
    ({ form, key, value, opt, }) => 
    ({ form, key, value, opt, })
);
export const initializeProduct = createAction(INITALIZE_PRODUCT);
export const initializeProductKey = createAction(
    INITALIZE_PRODUCT_KEY,
    ({ form, key }) => ({ form, key }),
);
export const initializeProducForm = createAction(
    INITALIZE_PRODUCT_FORM,
    ({form}) => ({form}),
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
        categorySub,
        categoryId,
    }) => ({
        name,
        image,
        sizes,
        colors,
        price,
        sale,
        description,
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
export const addSelectProduct = createAction(
    ADD_SELECT_PRODUCT,
    ({ name, sizeinfo, size, color, volume, price, mileage }) => 
    ({ name, sizeinfo, size, color, volume, price, mileage }),
);

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

export function* productSaga() {
    yield takeLatest(CREATE_PRODUCT, createProductSaga);
    yield takeLatest(GET_ALL_PRODUCT, getAllProductSaga);
    yield takeLatest(GET_PRODUCT, getProductSaga);
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
        categorySub: 0,
        categoryId: 0,
    },
    // 상품 생성 후, 서버에서 값 반환용 
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
            const { form, key } = payload;

            return {
                ...state,
                [form]: {
                    ...state[form], 
                    [key]: initialState[form][key],
                },
            };
        },
        // 특정 폼 초기화 (form: 'productForm' OR 'productSelectItems')
        [INITALIZE_PRODUCT_FORM]: (state, action) => {
            const { payload } = action;
            const { form } = payload;

            return {
                ...state,
                [form]: initialState[form],
            };
        },

        // 상품 폼 ONCHANGE (form: 'productForm' OR 'productSelectItems')
        [CHANGE_PRODUCT_FORMS]: (state, action) => {
            const { payload } = action;
            const { productForm, productSelectItems, productStatus } = state;            
            
            const { form } = payload;
            let { key, value, opt } = payload;
            let arrTmp = [];

            if (form === "productForm") {
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
            } else if (form === "productSelectItems") {                
                // eslint-disable-next-line
                const {items, totalprice} = productSelectItems;
                const {inputName, id} = opt;   
                 
                switch (key) {
                    case "items": {
                        let objTmp = items[id];
                        let mile = 0;
                        if (!productStatus) return;
                        const {price, sale} = productStatus.data;  // price는 productStatus에서 가져와야함!    productSelectItems에서 가져오면 꼬일듯.
                        
                        if (inputName === "volume") {                            

                            value = Number(value);
                            mile = (sale > 0) ? 
                                Math.floor((Number(price) - Number(price) / Number(sale)) * 0.01)
                                : Math.floor(Number((price) * 0.01));   

                            objTmp = {
                                ...objTmp,
                                [inputName]: value,
                                price: (Number(price) * value),
                                mileage: mile * value,
                            };  

                            arrTmp = items;                        
                            arrTmp.splice(id, 1, objTmp);
                        }                        
                        break;
                    }                    
                    default:
                        break;
                }            
            }   
        

            if (form === "productForm") {   
                return {
                    ...state,
                    [form]: {
                        ...state[form],
                        [key]: (form === "productForm") ? 
                            (key === 'sizes' || key === 'colors') ? arrTmp : value
                            :
                            (key === 'items') ? arrTmp : value,                   
                    },
                };
            } else {
                return {
                    ...state,
                    [form]: {
                        ...state[form],
                        [key]: (form === "productForm") ? 
                            (key === 'sizes' || key === 'colors') ? arrTmp : value
                            :
                            (key === 'items') ? arrTmp : value,                   
                    },
                };
            }

            /* 
                // ▲ 백업용 (조건 없었을 시 이 리턴 썼음.)
                return {
                    ...state,
                    [form]: {
                        ...state[form],
                        [key]: (form === "productForm") ? 
                            (key === 'sizes' || key === 'colors') ? arrTmp : value
                            :
                            (key === 'items') ? arrTmp : value,                   
                    },
                };                
            */            
        },
        // 상품 생성
        [CREATE_PRODUCT_SUCCESS]: (state, action) => {
            const { payload: product } = action;

            return {
                ...state,
                product,
                productError: null,
            };
        },
        [CREATE_PRODUCT_FAILURE]: (state, action) => {
            const { payload: productError } = action;

            return {
                ...state,
                product: null,
                productError,
            };
        },
        // 상품 전체
        [GET_ALL_PRODUCT_SUCCESS]: (state, action) => {
            const { payload: productStatus } = action;

            return {
                ...state,
                productStatus,
                productError: null,
            };
        },

        [GET_ALL_PRODUCT_FAILURE]: (state, action) => {
            const { payload: productError } = action;

            return {
                ...state,
                productStatus: null,
                productError,
            };
        },
        // 상품 상세
        [GET_PRODUCT_SUCCESS]: (state, action) => {
            const { payload: productStatus } = action;

            return {
                ...state,
                productStatus,
                productError: null,
            };
        },

        [GET_PRODUCT_FAILURE]: (state, action) => {
            const { payload: productError } = action;

            return {
                ...state,
                productStatus: null,
                productError,
            };
        },

        // 상품 상세 - 옵션 선택한 상태 저장
        [ADD_SELECT_PRODUCT]: (state, action) => {
            const { items } = state.productSelectItems;
            const { payload } = action;
            const { name, sizeinfo, size, color, volume, price, mileage } = payload;
            
            return {
                ...state,
                productSelectItems: {
                    ...state["productSelectItems"],
                    items: items.concat({ name, sizeinfo, size, color, volume, price, mileage }),
                },
            }
        }

    },
    initialState,
);

export default product;

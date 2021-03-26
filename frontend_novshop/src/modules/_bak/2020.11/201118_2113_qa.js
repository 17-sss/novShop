import { createRequestActionTypes, createRequestSaga } from '../lib/reduxUtil';
import { createAction, handleActions } from 'redux-actions';
import { takeLatest } from 'redux-saga/effects';
import * as qaAPI from '../lib/api/qa';

// :: 액션 이름 설정
const INITALIZE_QA = 'qa/INITALIZE_QA';
const INITALIZE_QA_FORM = 'qa/INITALIZE_QA_FORM';
const CHANGE_QA = 'qa/CHANGE_QA';

const [
    CREATE_QA,
    CREATE_QA_SUCCESS,
    CREATE_QA_FAILURE,
] = createRequestActionTypes('qa/CREATE_QA');

const [
    GET_PRODUCT_QA,
    GET_PRODUCT_QA_SUCCESS,
    GET_PRODUCT_QA_FAILURE,
] = createRequestActionTypes('qa/GET_PRODUCT_QA');


// :: 액션 생성 함수 작성
export const initializeQA = createAction(
    INITALIZE_QA
 );

export const initializeQAForm = createAction(
    INITALIZE_QA_FORM,
    ({form}) => ({form}),
);

export const createQA = createAction(
    CREATE_QA,
    ({userId, productId, subject, content, picture}) => ({            
        userId,
        productId,
        subject,
        content,
        picture,        
    }),
);

export const getProductQA = createAction(
    GET_PRODUCT_QA, 
    ({productId}) => ({productId})
);

// :: 사가 생성
const createQASaga = createRequestSaga(
    CREATE_QA,
    qaAPI.createQA,
);

const getProductQASaga = createRequestSaga(
    GET_PRODUCT_QA,
    qaAPI.getProductQA,
);

export function* qaSaga() {
    yield takeLatest(CREATE_QA, createQASaga);    
    yield takeLatest(GET_PRODUCT_QA, getProductQASaga);    
}


// :: 리듀서 초기값
const initialState = {
    qaForm: {
        userId: 0,        
        productId: 0,
        subject: '',
        content: '',
        picture: '',        
    },
    qa: null,
    qaError: null,
    qaStatus: null,
};


// :: 리듀서
const qa = handleActions(
    {
        // QA 전체 초기화
        [INITALIZE_QA]: (state) => {
            return {
                ...state,
                qaForm: initialState['qaForm'],                
                qa: null,
                qaError: null,
                qaStatus: null,                
            };
        },

        // QA (선택적) 초기화
        [INITALIZE_QA_FORM]: (state, action) => {            
            const { payload } = action;
            const { form } = payload;

            return {
                ...state,
                [form]: initialState[form],
            };
        },

        // onChange (qaForm)
        [CHANGE_QA]: (state, action) => {
            const { payload } = action;
            const { key, value } = payload;

            return {
                ...state,
                qaForm: {
                    ...state["qaForm"],
                    [key]: value,
                },
            };
        },

        // QA 생성
        [CREATE_QA_SUCCESS]: (state, action) => {
            const { payload: qa } = action;

            return {
                ...state,
                qa,
                qaError: null,
            };
        },

        [CREATE_QA_FAILURE]: (state, action) => {
            const { payload: qaError } = action;

            return {
                ...state,
                qa: null,
                qaError,
            };
        },

        // 특정 상품 QA GET
        [GET_PRODUCT_QA_SUCCESS]: (state, action) => {
            const { payload: qaStatus } = action;

            return {
                ...state,
                qaStatus,
                qaError: null,
            };
        },

        [GET_PRODUCT_QA_FAILURE]: (state, action) => {
            const { payload: qaError } = action;

            return {
                ...state,
                qaStatus: null,
                qaError,
            };
        },



    }, initialState
);

export default qa;
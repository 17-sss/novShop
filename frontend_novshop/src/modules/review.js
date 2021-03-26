import { createRequestActionTypes, createRequestSaga } from '../lib/reduxUtil';
import { createAction, handleActions } from 'redux-actions';
import { takeLatest } from 'redux-saga/effects';
import * as reviewAPI from '../lib/api/review';

// :: 액션 이름 설정
const INITALIZE_REVIEW = 'review/INITALIZE_REVIEW';
const INITALIZE_REVIEW_FORM = 'review/INITALIZE_REVIEW_FORM';
const CHANGE_REVIEW = 'review/CHANGE_REVIEW';

const [
    CREATE_REVIEW,
    CREATE_REVIEW_SUCCESS,
    CREATE_REVIEW_FAILURE,
] = createRequestActionTypes('review/CREATE_REVIEW');

const [
    GET_PRODUCT_REVIEW,
    GET_PRODUCT_REVIEW_SUCCESS,
    GET_PRODUCT_REVIEW_FAILURE,
] = createRequestActionTypes('review/GET_PRODUCT_REVIEW');


// :: 액션 생성 함수 작성
export const initializeReview = createAction(
    INITALIZE_REVIEW
);

export const initializeReviewForm = createAction(
    INITALIZE_REVIEW_FORM,
    ({form}) => ({form}),
);

export const createReview = createAction(
    CREATE_REVIEW,
    ({ userId,  productId, subject, content, picture, rate }) => ({
        userId,
        productId,
        subject,
        content,
        picture,
        rate,
    }),
);

export const getProductReview = createAction(
    GET_PRODUCT_REVIEW, 
    ({productId}) => ({productId})
);

// :: 사가 생성
const createReviewSaga = createRequestSaga(
    CREATE_REVIEW,
    reviewAPI.createReview,
);

const getProductReviewSaga = createRequestSaga(
    GET_PRODUCT_REVIEW,
    reviewAPI.getProductReview,
);

export function* reviewSaga() {
    yield takeLatest(CREATE_REVIEW, createReviewSaga);    
    yield takeLatest(GET_PRODUCT_REVIEW, getProductReviewSaga);    
}


// :: 리듀서 초기값
const initialState = {
    reviewForm: {
        userId: 0,        
        productId: 0,
        subject: '',
        content: '',
        picture: '',
        rate: 0,
    },
    review: null,
    reviewError: null,
    reviewStatus: null,
};


// :: 리듀서
const review = handleActions(
    {
        // review 전체 초기화
        [INITALIZE_REVIEW]: (state) => {
            return {
                ...state,
                reviewForm: initialState['reviewForm'],                
                review: null,
                reviewError: null,
                reviewStatus: null,                
            };
        },

        // review (선택적) 초기화
        [INITALIZE_REVIEW_FORM]: (state, action) => {            
            const { payload } = action;
            const { form } = payload;

            return {
                ...state,
                [form]: initialState[form],
            };
        },

        // onChange (reviewForm)
        [CHANGE_REVIEW]: (state, action) => {
            const { payload } = action;
            const { key, value } = payload;

            return {
                ...state,
                reviewForm: {
                    ...state["reviewForm"],
                    [key]: value,
                },
            };

        },

        // 리뷰 생성
        [CREATE_REVIEW_SUCCESS]: (state, action) => {
            const { payload: review } = action;

            return {
                ...state,
                review,
                reviewError: null,
            };
        },

        [CREATE_REVIEW_FAILURE]: (state, action) => {
            const { payload: reviewError } = action;

            return {
                ...state,
                review: null,
                reviewError,
            };
        },

        // 특정 상품 리뷰 GET
        [GET_PRODUCT_REVIEW_SUCCESS]: (state, action) => {
            const { payload: reviewStatus } = action;

            return {
                ...state,
                reviewStatus,
                reviewError: null,
            };
        },

        [GET_PRODUCT_REVIEW_FAILURE]: (state, action) => {
            const { payload: reviewError } = action;

            return {
                ...state,
                reviewStatus: null,
                reviewError,
            };
        },



    }, initialState
);

export default review;
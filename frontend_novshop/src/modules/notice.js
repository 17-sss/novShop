/* 
    - Notice 생성과 onChange는 Write 모듈에서 처리
    - 여기선 Notice 불러오는것만 담당.
*/
import { createRequestActionTypes, createRequestSaga } from '../lib/reduxUtil';
import { createAction, handleActions } from 'redux-actions';
import { takeLatest } from 'redux-saga/effects';
import * as noticeAPI from '../lib/api/notice';

// :: 액션 이름 설정
const INITALIZE_NOTICE = 'notice/INITALIZE_NOTICE';
const INITALIZE_NOTICE_FORM = 'notice/INITALIZE_NOTICE_FORM';

const [
    GET_NOTICE,
    GET_NOTICE_SUCCESS,
    GET_NOTICE_FAILURE,
] = createRequestActionTypes('notice/GET_NOTICE');

const [
    GET_ALL_NOTICE,
    GET_ALL_NOTICE_SUCCESS,
    GET_ALL_NOTICE_FAILURE,
] = createRequestActionTypes('notice/GET_ALL_NOTICE');

// :: 액션 생성 함수 작성
export const initializeNotice = createAction(INITALIZE_NOTICE);

export const initializeNoticeForm = createAction(
    INITALIZE_NOTICE_FORM,
    ({ form }) => ({ form }),
);

export const getNotice = createAction(GET_NOTICE, ({id}) => ({id}));
export const getAllNotice = createAction(GET_ALL_NOTICE);

// :: 사가 생성
const getNoticeSaga = createRequestSaga(GET_NOTICE, noticeAPI.getNotice);
const getAllNoticeSaga = createRequestSaga(GET_ALL_NOTICE, noticeAPI.getAllNotice);

export function* noticeSaga() {    
    yield takeLatest(GET_NOTICE, getNoticeSaga);
    yield takeLatest(GET_ALL_NOTICE, getAllNoticeSaga);
}

// :: 리듀서 초기값
const initialState = {    
    noticeStatus: null,
    noticeError: null,
};

// :: 리듀서
const notice = handleActions(
    {
        // NOTICE 전체 초기화
        [INITALIZE_NOTICE]: (state) => {
            return {
                ...state,                
                noticeStatus: null,
                noticeError: null,
            };
        },

        // NOTICE (선택적) 초기화
        [INITALIZE_NOTICE_FORM]: (state, action) => {
            const { payload } = action;
            const { form } = payload;

            return {
                ...state,
                [form]: initialState[form],
            };
        },

        // 특정 NOTICE 가져옴
        [GET_NOTICE_SUCCESS]: (state, action) => {
            const { payload: noticeStatus } = action;

            return {
                ...state,
                noticeStatus,
                noticeError: null,
            };
        },

        [GET_NOTICE_FAILURE]: (state, action) => {
            const { payload: noticeError } = action;

            return {
                ...state,
                noticeStatus: null,
                noticeError,
            };
        },

        // NOTICE 전부 가져옴
        [GET_ALL_NOTICE_SUCCESS]: (state, action) => {
            const { payload: noticeStatus } = action;

            return {
                ...state,
                noticeStatus,
                noticeError: null,
            };
        },

        [GET_ALL_NOTICE_FAILURE]: (state, action) => {
            const { payload: noticeError } = action;

            return {
                ...state,
                noticeStatus: null,
                noticeError,
            };
        },
    },
    initialState,
);

export default notice;

/* 
    - QA, Notice 관련 데이터는 여기서 생성
    - 여기서 생성하기에 당연히 onChange도 여기서 관리    
*/

import { createRequestActionTypes, createRequestSaga } from '../lib/reduxUtil';
import { createAction, handleActions } from 'redux-actions';
import { takeLatest } from 'redux-saga/effects';
import * as noticeAPI from '../lib/api/notice';
import * as qaAPI from '../lib/api/qa';
import * as uploadAPI from '../lib/api/upload';

// :: 액션 이름 설정
const INITALIZE_WRITE = 'write/INITALIZE_WRITE';
const INITALIZE_WRITE_FORM = 'write/INITALIZE_WRITE_FORM';
const CHANGE_WRITE = 'write/CHANGE_WRITE';

const [
    CREATE_WRITE_NOTICE,
    CREATE_WRITE_NOTICE_SUCCESS,
    CREATE_WRITE_NOTICE_FAILURE,
] = createRequestActionTypes('write/CREATE_WRITE_NOTICE'); // 공지사항 create

const [
    CREATE_WRITE_QA,
    CREATE_WRITE_QA_SUCCESS,
    CREATE_WRITE_QA_FAILURE,
] = createRequestActionTypes('write/CREATE_WRITE_QA'); // 고객센터 (qa) create

const [
    IMAGE_UPLOAD,
    IMAGE_UPLOAD_SUCCESS,
    IMAGE_UPLOAD_FAILURE,
] = createRequestActionTypes('write/IMAGE_UPLOAD'); // 작성 중 이미지 업로드


// :: 액션 생성 함수 작성
export const initializeWrite = createAction(
    INITALIZE_WRITE,
    // user 실제 id를 이용하여 닉넴가져오는건 따로? 그냥 유저아이디도 가져와도되지않나
    // ({ userNumID, page } = { userNumID: -1, page: '' }) => ({ userNumID, page }),
    ({ page } = { page: '' }) => ({ page }),
);
export const initializeWriteForm = createAction(
    INITALIZE_WRITE_FORM,
    ({ form }) => ({ form }),
);
export const changeWriteForm = createAction(CHANGE_WRITE, ({ key, value }) => ({ key, value }));

export const createWriteNotice = createAction(
    CREATE_WRITE_NOTICE,
    ({ userId, subject, content }) => ({
        userId,
        subject,
        content,
    }),
);
export const createWriteQA = createAction(
    CREATE_WRITE_QA,
    ({ userId, productId, subject, content, picture }) => ({
        userId,
        productId,
        subject,
        content,
        picture,
    }),
);
export const imageUpload = createAction(
    IMAGE_UPLOAD,
    ({ imgData }) => ({ imgData }),
);

// :: 사가 생성
const createWriteNoticeSaga = createRequestSaga(
    CREATE_WRITE_NOTICE,
    noticeAPI.createNotice,
);
const createWriteQASaga = createRequestSaga(CREATE_WRITE_QA, qaAPI.createQA);
const imageUploadSaga = createRequestSaga(IMAGE_UPLOAD, uploadAPI.imageUpload);


export function* writeSaga() {
    yield takeLatest(CREATE_WRITE_NOTICE, createWriteNoticeSaga);
    yield takeLatest(CREATE_WRITE_QA, createWriteQASaga);
    yield takeLatest(IMAGE_UPLOAD, imageUploadSaga);
}

// :: 리듀서 초기값
const initialState = {
    writeForm: {
        // 1. 서버에 전달 O (userId, subject, content ==> notice, 전부쓰는건 ==> qa)        
        userId: 0,
        productId: 0,
        subject: '',
        content: null,
        picture: '',

        // 2. 서버에 전달 X
        boardType: '',
        userViewId: '',
    },
    write: null,
    writeImgName: null,
    writeError: null,
};

// :: 리듀서
const write = handleActions(
    {
        // WRITE 전체 초기화
        [INITALIZE_WRITE]: (state, action) => {
            const { payload } = action;
            const { page } = payload;

            return {
                ...state,
                writeForm: {
                    ...initialState['writeForm'],
                    boardType: page ? page : '',
                },
                write: null,
                writeImgName: null,
                writeError: null,
            };
        },

        // WRITE 선택적 초기화
        [INITALIZE_WRITE_FORM]: (state, action) => {
            const { payload } = action;
            const { form } = payload;

            return {
                ...state,
                [form]: initialState[form],
            };
        },

        // onChange (writeform)
        [CHANGE_WRITE]: (state, action) => {
            const { payload } = action;
            const { key, value } = payload;

            return {
                ...state,
                writeForm: {
                    ...state['writeForm'],
                    [key]: value,
                },
            };
        },

        // WRITE :: NOTICE 생성
        [CREATE_WRITE_NOTICE_SUCCESS]: (state, action) => {
            const { payload: write } = action;

            return {
                ...state,
                write,
                writeError: null,
            };
        },

        [CREATE_WRITE_NOTICE_FAILURE]: (state, action) => {
            const { payload: writeError } = action;

            return {
                ...state,
                write: null,
                writeError,
            };
        },

        // WRITE :: QA 생성
        [CREATE_WRITE_QA_SUCCESS]: (state, action) => {
            const { payload: write } = action;

            return {
                ...state,
                write,
                writeError: null,
            };
        },

        [CREATE_WRITE_QA_FAILURE]: (state, action) => {
            const { payload: writeError } = action;

            return {
                ...state,
                write: null,
                writeError,
            };
        },

        // 이미지 업로드 (quill 에디터에서 작성 중 이미지 1개 업로드)
        [IMAGE_UPLOAD_SUCCESS]: (state, action) => {
            const { payload: writeImgName } = action;

            return {
                ...state,
                writeImgName,
                writeError: null,
            };
        },

        [IMAGE_UPLOAD_FAILURE]: (state, action) => {
            const { payload: writeError } = action;

            return {
                ...state,
                writeImgName: null,
                writeError,
            };
        },
    },
    initialState,
);

export default write;

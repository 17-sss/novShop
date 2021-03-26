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
    ({ form, subform } = { subform: '' }) => ({ form, subform }),
);

export const changeWriteForm = createAction(
    CHANGE_WRITE,
    ({ key, subkey, value } = { subkey: '' }) => ({ key, subkey, value }),
);

export const createWriteNotice = createAction(
    CREATE_WRITE_NOTICE,
    ({ subject, content, userId }) => ({
        subject,
        content,
        // view
        userId,
    }),
);
export const createWriteQA = createAction(
    CREATE_WRITE_QA,
    ({ subject, content, userId, productId }) => ({
        subject,
        content,
        // view
        userId,
        productId,                        
    }),
);

export const imageUpload = createAction(
    IMAGE_UPLOAD,
    ({ imgData }) => ({ imgData }),
);

// :: 사가 생성
const createWriteNoticeSaga = createRequestSaga(CREATE_WRITE_NOTICE, noticeAPI.createNotice);
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
        // 각 분류마다 content가 있는 이유는 게시판을 변경했을때 해당 내용이 저장되게 하기 위함.         
        notice: {
            subject: '',
            content: '',
            view: 0,
            userId: 0,
        },
        qa: {
            subject: '',
            content: '',
            view: 0,
            userId: 0,
            productId: 0,
        },
        
        // 서버에 전달 X        
        boardType: '',
        userViewId: '',
    },
    
    write: null,
    writeImgName: null,     // Quill 에디터에서 이미지 불러올 시, 서버에 이미지를 저장하고 업로드 된 이미지 이름을 불러옴
    writeError: null,
};

// :: 리듀서

// write 리듀서용 함수 (SUCCESS or FAILURE)
const successFunc = (state, action) => {
    const { payload: write } = action;

    return {
        ...state,
        write,
        writeError: null,
    };
};

const failureFunc = (state, action) => {
    const { payload: writeError } = action;

    return {
        ...state,
        write: null,
        writeError,
    };
};

const write = handleActions(
    {
        // WRITE 전체 초기화
        [INITALIZE_WRITE]: (state, action) => {
            const { payload: {page} } = action;            

            return {
                ...state,
                writeForm: {
                    ...initialState['writeForm'],                    
                    boardType: page ? page : '',                    
                    userViewId: '',
                },
                write: null,
                writeImgName: null,
                writeError: null,
            };
        },

        // WRITE 선택적 초기화
        [INITALIZE_WRITE_FORM]: (state, action) => {
            const {
                payload: { form, subform },
            } = action;
            const isSubOK = form === 'writeForm' && form && subform;
            return {
                ...state,
                [form]: isSubOK
                    ? { ...state[form], [subform]: initialState[form][subform] }
                    : initialState[form],                
            };
        },
        
        // onChange (writeform)
        [CHANGE_WRITE]: (state, action) => {
            const {
                payload: { key, subkey, value },
            } = action;

            return {
                ...state,
                writeForm: {
                    ...state['writeForm'],
                    [key]: subkey
                        ? { ...state['writeForm'][key], [subkey]: value }
                        : value,
                },
            };
        },

        // WRITE :: NOTICE 생성
        [CREATE_WRITE_NOTICE_SUCCESS]: successFunc,
        [CREATE_WRITE_NOTICE_FAILURE]: failureFunc,

        // WRITE :: QA 생성
        [CREATE_WRITE_QA_SUCCESS]: successFunc,
        [CREATE_WRITE_QA_FAILURE]: failureFunc,

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

// auth :: Redux Module

// Ducks 구조 사용
/* 
    1) export default 를 이용하여 리듀서를 내보내야 한다.
    2) export를 이용하여 액션 생성 함수를 내보내야 한다.
    3) 액션 타입 이름은 npm-module-or-app/reducer/ACTION_TYPE 형식으로 만들어야 한다.
    4) 외부 리듀서에서 모듈의 액션 타입이 필요할 때는 액션 타입을 내보내도 된다.

*/
import { createRequestActionTypes, createRequestSaga } from '../lib/reduxUtil';
import { createAction, handleActions } from 'redux-actions';
import { takeLatest } from 'redux-saga/effects';
import * as authAPI from '../lib/api/auth';

// 액션 이름 설정
const CHANGE_FIELD = 'auth/CHANGE_FIELD';
const INITALIZE_AUTH = 'auth/INITALIZE_AUTH';
const INITALIZE_AUTH_FORM = 'auth/INITALIZE_AUTH_FORM';

const [LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE] = createRequestActionTypes(
    'auth/LOGIN',
);

const [REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE] = createRequestActionTypes(
    'auth/REGISTER',
);

const [GET_USER_INFO, GET_USER_INFO_SUCCESS, GET_USER_INFO_FAILURE] = createRequestActionTypes(
    'user/GET_USER_INFO',
);

const [UPD_USER_INFO, UPD_USER_INFO_SUCCESS, UPD_USER_INFO_FAILURE] = createRequestActionTypes(
    'user/UPD_USER_INFO',
);

// 액션 생성 함수 생성
/*  
// 일반 액션 생성 함수 샘플.
export const changeField = ({form, key, value}) => ({
    type: CHANGE_FIELD,
    payload: {
        form,
        key,
        value,
    }
});

export const initializeAuthForm = form => ({
    type: INITALIZE_AUTH_FORM,
    payload: form,
});

*/
export const changeField = createAction(
    CHANGE_FIELD,
    ({ form, key, value, addKey } = { addKey: '' }) => ({
        form, // register, login
        key, // username, password, passwordConfirm
        value, // 실제 바꾸려는 값
        addKey, // register에서 address나 phonenumber 수정할 경우
    }),
);

export const initializeAuth = createAction(INITALIZE_AUTH);     
export const initializeAuthForm = createAction( // "register" / "login"
    INITALIZE_AUTH_FORM,    
    ({ form, subForm } = { subForm: '' }) => ({ form, subForm }),
); 

export const login = createAction(LOGIN, ({ userid, userpwd }) => {
    return {
        userid,
        userpwd,
    };
});
export const register = createAction(
    REGISTER,
    ({ userid, userpwd, username, address, phonenumber, email }) => {        
        return {
            userid,
            userpwd,
            username,
            address:  JSON.stringify(address),
            phonenumber: JSON.stringify(phonenumber),
            email,
        };
    },
);
export const getUserInfo = createAction(GET_USER_INFO, ({id}) => ({id}));
export const updUserInfo = createAction(
    UPD_USER_INFO,
    ({ id, userid, userpwd, username, address, phonenumber, email }) => {
        return {
            id,
            userid,
            userpwd,
            username,
            address: JSON.stringify(address),
            phonenumber: JSON.stringify(phonenumber),
            email,
        };
    },
);

// 사가 생성
const registerSaga = createRequestSaga(REGISTER, authAPI.register);
const loginSaga = createRequestSaga(LOGIN, authAPI.login);
const getUserInfoSaga = createRequestSaga(GET_USER_INFO, authAPI.getUserInfo);
const updUserInfoSaga = createRequestSaga(UPD_USER_INFO, authAPI.updUserInfo);

export function* authSaga() {
    // 마지막에 발생된 액션타입이 LOGIN or REGISTER인 경우 실행
    yield takeLatest(REGISTER, registerSaga);
    yield takeLatest(LOGIN, loginSaga);
    yield takeLatest(GET_USER_INFO, getUserInfoSaga);
    yield takeLatest(UPD_USER_INFO, updUserInfoSaga);
};

// 리듀서 초기값
const initialState = {
    register: {
        userid: '',
        username: '',
        userpwd: '',
        userpwdConfirm: '',
        address: {
            addressPostNo: '', // 우편번호
            addressAddr1: '', // 기본주소
            addressAddr2: '', // 나머지주소
        },
        phonenumber: {
            phoneNumSelect: '010',
            phoneNum1: '',
            phoneNum2: '',
        },
        email: '',
    },
    login: {
        userid: '',
        userpwd: '',
    },
    auth: null,
    authError: null,
};

// 리듀서 생성
const auth = handleActions(
    {
        [CHANGE_FIELD]: (state, action) => {
            const { payload } = action;
            const { form, key, value, addKey } = payload;
            if(!value && key === 'address') return;

            return {
                ...state,
                [form]: {
                    ...state[form],
                    [key]: addKey ? {
                        ...state[form][key],
                        [addKey]: value,
                    }: value,
                },
            };
        },

        // 초기화
        [INITALIZE_AUTH]: (state, action) => (initialState),

        // "register" / "login" 객체 개별 초기화
        [INITALIZE_AUTH_FORM]: (state, action) => {
            const { payload } = action; // action의 payload를 가져오지만, 여기선 form이라는 이름으로 씀
            const { form, subForm } = payload;

            return {
                ...state,
                [form]: subForm
                    ? {
                          ...state[form],
                          [subForm]: initialState[form][subForm],
                      }
                    : initialState[form],
                authError: null, // 폼 전환 시 회원 인증 에러 초기화
            };
        },

        // 회원가입
        [REGISTER_SUCCESS]: (state, action) => {
            const { payload: auth } = action;

            return {
                ...state,
                authError: null,
                auth,
            };
        },        
        [REGISTER_FAILURE]: (state, action) => {
            const { payload: error } = action;

            return {
                ...state,
                authError: error,
            };
        },

        // 로그인
        [LOGIN_SUCCESS]: (state, action) => {
            const { payload: auth } = action;

            return {
                ...state,
                authError: null,
                auth,
            };
        },        
        [LOGIN_FAILURE]: (state, action) => {
            const { payload: error } = action;

            return {
                ...state,
                authError: error,
            };
        },

        // 회원정보 수정를 위해 기존 정보 가져오기
        [GET_USER_INFO_SUCCESS]: (state, action) => {
            const { payload } = action;
            const { data } = payload;            
            const { address, phonenumber } = data;
            
            const { addressPostNo, addressAddr1, addressAddr2 } = JSON.parse(address);
            const { phoneNumSelect, phoneNum1, phoneNum2 } = JSON.parse(phonenumber);

            const register = {
                ...data,
                userpwd: '',
                userpwdConfirm: '',
                address: {
                    addressPostNo,
                    addressAddr1,
                    addressAddr2,
                },
                phonenumber: {
                    phoneNumSelect,
                    phoneNum1,
                    phoneNum2,
                }
            };

            return {
                ...state,
                register,
                authError: null,
            };
        },  
        [GET_USER_INFO_FAILURE]: (state, action) => {
            const { payload: error } = action;

            return {
                ...state,
                register: null,
                authError: error,
            };
        },

        // 회원정보 수정
        [UPD_USER_INFO_SUCCESS]: (state, action) => {
            const { payload: auth } = action;

            return {
                ...state,
                authError: null,
                auth,
            };
        },        
        [UPD_USER_INFO_FAILURE]: (state, action) => {
            const { payload: error } = action;

            return {
                ...state,
                authError: error,
            };
        },
    },
    initialState,
);

export default auth;

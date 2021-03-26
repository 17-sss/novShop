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
const INITALIZE_FORM = 'auth/INITALIZE_FORM';

const [LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE] = createRequestActionTypes(
    'auth/LOGIN',
);

const [REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE] = createRequestActionTypes(
    'auth/REGISTER',
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

export const initializeForm = form => ({
    type: INITALIZE_FORM,
    payload: form,
});

*/
export const changeField = createAction(
    CHANGE_FIELD,
    ({ form, key, value }) => ({
        form, // register, login
        key, // username, password, passwordConfirm
        value, // 실제 바꾸려는 값
    }),
);

export const initializeForm = createAction(INITALIZE_FORM, (form) => form); // "register" / "login"


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
            address, 
            phonenumber, 
            email
        };
    },
);

// 사가 생성
const registerSaga = createRequestSaga(REGISTER, authAPI.register);
const loginSaga = createRequestSaga(LOGIN, authAPI.login);

export function* authSaga() {
    // 마지막에 발생된 액션타입이 LOGIN or REGISTER인 경우 실행
    yield takeLatest(REGISTER, registerSaga);
    yield takeLatest(LOGIN, loginSaga);
}

// 리듀서 초기값
const initialState = {
    register: {
        userid: '',
        username: '',
        userpwd: '',
        userpwdConfirm: '',
        address: '',
        phonenumber: '',
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
            const { form, key, value } = payload;

            // [1] immer 안쓸시
            return {
                ...state,
                [form]: {
                    ...state[form], // 예: state.login 객체를 불변성유지 해줌.
                    [key]: value, // 현재 작업하고 있는 값만 바꿈. (key는 userid가 될수도, userpwd가 될수도)
                },
            };
            // [2] immer 썼을시
            /*
            return produce(state, draft => {                
                draft[form][key] = value;   // 예: state.register.username을 바꾼다.
            });                                  
            */
        },

        // "register" / "login" 객체 초기화.
        [INITALIZE_FORM]: (state, action) => {
            const { payload: form } = action; // action의 payload를 가져오지만, 여기선 form이라는 이름으로 씀
            return {
                ...state,
                [form]: initialState[form],
                authError: null, // 폼 전환 시 회원 인증 에러 초기화
            };
        },
        /*      // 위와 같은 동작임.
        [INITALIZE_FORM]: (state, {payload: form}) => ({
            ...state,
            [form]: initialState[form],
            authError: null,    // 폼 전환 시 회원 인증 에러 초기화    
        }),
        */        

        // 회원가입 성공
        [REGISTER_SUCCESS]: (state, action) => {
            const { payload: auth } = action;

            return {
                ...state,
                authError: null,
                auth,
            };
        },

        // 회원가입 실패
        [REGISTER_FAILURE]: (state, action) => {
            const { payload: error } = action;

            return {
                ...state,
                authError: error,
            };
        },

        // 로그인 성공
        [LOGIN_SUCCESS]: (state, action) => {
            const { payload: auth } = action;

            return {
                ...state,
                authError: null,
                auth,
            };
        },

        // 로그인 실패
        [LOGIN_FAILURE]: (state, action) => {
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

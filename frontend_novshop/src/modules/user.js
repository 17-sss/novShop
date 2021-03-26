// user :: Redux Module (유저 세션체크용)
import { createRequestActionTypes, createRequestSaga } from '../lib/reduxUtil';
import { createAction, handleActions } from 'redux-actions';
import { takeLatest, call } from 'redux-saga/effects';
import * as authAPI from '../lib/api/auth';

const [CHECK, CHECK_SUCCESS, CHECK_FAILURE]  = createRequestActionTypes('user/CHECK');
const TEMP_SET_USER = 'user/TEMP_SET_USER';
const LOGOUT = 'user/LOGOUT';
/*
export const check = () => {
    return {
        type: CHECK,
        payload: null,
    };
};
*/
export const check = createAction(CHECK);
export const tempSetUser = createAction(TEMP_SET_USER);
export const logout = createAction(LOGOUT);



// !! usercheck에 괄호 넣으면 내가 원하는 곳에서 실행되지않고 계속실행댐!!
const checkSaga = createRequestSaga(CHECK, authAPI.usercheck);

// 유저 체크 실패시, localStorage안에 있는 정보도 초기화
const checkFailureSaga = () => {
    try {
        localStorage.removeItem('user');  
    } catch (error) {
        console.log('localStorage is not working');    
    }
};

// 로그아웃 전용 Saga
function* logoutSaga() {
    try {
        yield call(authAPI.logout);
        localStorage.removeItem('user');  
    } catch (error) {
        console.error(error);
    }
}

export function* userSaga() {        
    yield takeLatest(CHECK, checkSaga);         // takeLatest: 마지막에 실행된 액션을 기준으로 실행됨.
    yield takeLatest(CHECK_FAILURE, checkFailureSaga);
    yield takeLatest(LOGOUT, logoutSaga);
}


const initialState = {
    user: null,
    checkError: null,
};

const user = handleActions(
    {
        [LOGOUT]: (state) => {
            return {
                ...state,
                user: null,
            };
        },
        [CHECK_SUCCESS]: (state, action) => {
            const { payload: user } = action;
            return {
                ...state,
                user,
                checkError: null,
            }
        },
        [CHECK_FAILURE]: (state, action) => {
            const { payload: error } = action;
            return {
                ...state,
                user: null,
                checkError: error,
            }
        },
        [TEMP_SET_USER]: (state, action) => {
            const {payload: user} = action;
            return {
                ...state,
                user,
            }
        }
    }, 
    initialState
);

export default user;
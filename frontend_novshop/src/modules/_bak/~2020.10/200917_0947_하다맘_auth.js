import { createAction } from 'redux-actions';
import { createRequestActionTypes  } from "../../../lib/reduxUtil";

// [1] 액션 생성
const INITALIZE_FORM = 'auth/INITALIZE_FORM';   
// export const initializeForm = createAction(INITALIZE_FORM, form => form);   // login & register
const initializeForm = (form) => {
    return {
        type: INITALIZE_FORM,        
        form,
    };
};



const [LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE] = createRequestActionTypes('auth/LOGIN');
/*
export const login = createAction(LOGIN, ({userid, userpwd}) => {
    return {
        userid,
        userpwd,
    };
});
*/
export const login = ({userid, userpwd}) => {
    return {
        type: LOGIN,
        payload: {
            userid,
            userpwd,
        }
    };
};

const [REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE] = createRequestActionTypes('auth/R EGISTER');
/*
export const register = createAction(REGISTER, ({userid, userpwd}) => {
    return {
        userid,
        userpwd,
    };
});
*/
export const register = ({userid, userpwd}) => {
    return {
        type: REGISTER,
        payload: {
            userid,
            userpwd,
        }
        
    };
};

const CHANGE_FIELD = 'auth/CHANGE_FIELD';
/*
export const changeField = createAction(CHANGE_FIELD, ({form, key, value}) => {
    return {
        form,   // register, login
        key,    // userid, userpwd, userpwdConfirm
        value,  // 실제 바꾸려는 값
    };
});
*/

export const changeField = ({form, key, value}) => {
    return {
        type: CHANGE_FIELD,
        payload: {
            form,
            key,
            value,
        }
    };
};


// [2] 사가 생성은 나중에..
// ======================

const initialState = {
    register: {
        userid: '',
        userpwd: '',
        userpwdConfirm: '',
    },
    login: {
        userid: '',
        userpwd: '',
    },
    auth: null,
    authError: null,
};
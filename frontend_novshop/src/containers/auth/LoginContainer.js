import React, {useEffect, useState} from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { changeField, initializeAuthForm, login } from "../../modules/auth";
import { check } from '../../modules/user';

import LoginRegisterTemplate from "../../components/auth/LoginRegisterTemplate";

const LoginContainer = ({history}) => {
    const [error, setError] = useState(null);

    const dispatch = useDispatch();
    const { form, auth, authError, user } = useSelector( ({auth, user}) => {   

        return {
            form: auth.login,
            auth: auth.auth,
            authError: auth.authError,
            user: user.user,
        };
    } );
    
    const onChange = (e) => {
        const {name, value} = e.target;  

        dispatch(            
            changeField({                
                form: 'login',
                key: name,
                value,                
            })
        );
    };
    
    const onSubmit = (e) => {
        e.preventDefault();        
        
        const {userid, userpwd} = form;
        dispatch(login({userid, userpwd}));
    };

    // 컴포넌트가 처음 렌더링될 때 form을 초기화
    useEffect(() => {
        dispatch(
            initializeAuthForm({form: 'login'})
        ); 
    }, [dispatch]);

    // 로그인 여부 체크
    useEffect(() => {

        if (authError) {
            const {status} = authError;
                    
            if (status === 401) {
                setError('아이디나 비밀번호를 확인해주세요.');
            } else if (status === 500) {
                setError('서버에 오류가 있습니다.');
            }
            return;
        }

        if (auth) {            
            const {success} = auth;
            success && console.log('로그인 성공');
            
            dispatch(check());
        }
    }, [authError, auth, dispatch]);

    
    // (추후 구현) 로그인 성공 후, 메인으로 이동.
    useEffect(() => {
        if (user) {
            history.push('/');

            // 로그인 상태 유지하기위해 브라우저에 내장되어있는 localStorage 사용
            try {                
                localStorage.setItem('user', JSON.stringify(user));
            } catch (error) {
                console.log('localStorage is not working');
            }
        }
    }, [history, user])
    


    return (
        <LoginRegisterTemplate
            type = "login"
            onSubmit = {onSubmit}
            onChange = {onChange}
            form = {form}
            error = {error}
        />
    );
};

// ▼ history 개체 같은거 이용하려할때, withRouter로 해당 개체 감싸면댐.(여기선 LoginContainer)
export default withRouter(LoginContainer);
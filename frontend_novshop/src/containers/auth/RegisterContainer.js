import React, {useEffect, useState} from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { changeField, initializeAuthForm, register, login, getUserInfo, updUserInfo } from "../../modules/auth";
import { check } from "../../modules/user";

import LoginRegisterTemplate from "../../components/auth/LoginRegisterTemplate";

const RegisterContainer = (props) => {         
    const { history, isUpdateForm } = props;    // isUpdateForm은 회원정보 수정일 시 true (MemberPage -> RegisterContainer(ProfileContainer))
    const [error, setError] = useState(null);

    const dispatch = useDispatch();
    const { form, auth, authError, user, addressType, addressResult } = useSelector( ({auth, user, util}) => {        
        /* 
            useSelector에서 불러오는 auth는 /modules/auth.js의 auth 리듀서
            여기서 console.log(auth) 해보면, auth의 initialState 값나옴.   
            즉 리덕스에 저장되어있는거 불러오는 듯.
        */
        return {
            form: auth.register,    // auth['register'] 도 가능
            auth: auth.auth,
            authError: auth.authError,
            user: user.user,
            addressType: util.addressType,
            addressResult: util.addressResult,
        };
    });

    // phoneFrontList, 구매창 연락처 앞부분 리스트(지역번호, 휴대폰 앞 번호 등) (Option 태그에 사용)
    const phoneFrontList = [            
        '010', '011', '016', '017', '018', '019',
        '02', '031', '032', '033', 
        '041', '042', '043', '044', 
        '051', '052', '053', '054', '055',
        '061', '062', '063', '064',
        '0502', '0503', '0504', '0505', '0506', '0507', '0508', '070', 
    ];

    // 객체에 값이 있는지 확인하는 func
    const isValueOK = (obj) => {
        let result = true;
        for (const key in obj) {                
            const value = obj[key];
            if (!value) {
                result = false;
                break;
            }
        }
        return result;
    };
    // -----------
    
    // onChange
    const onChange = (e) => {
        const {name, value} = e.target;        
        const exceptionalNames = [
            'addressPostNo', 'addressAddr1', 'addressAddr2',
            'phoneNumSelect', 'phoneNum1', 'phoneNum2',
        ];

        let addrOrPhone = '';
        if (exceptionalNames.indexOf(name) > -1) {
            if (name.indexOf('addr') > -1) 
                addrOrPhone = 'address'
            else
                addrOrPhone = 'phonenumber';
        }

        dispatch(            
            changeField({                
                form: 'register',
                key: addrOrPhone ? addrOrPhone : name,
                value,
                addKey: addrOrPhone ? name : '',                 
            })
        );
    };
    
    /*
        ** onSubmit 이벤트가 발생했을 때 
            1. register 함수에 현재 userid userpwd username 파라미터로 넣어서 액션을 디스패치.
            2. 사가에서 API 요청을 처리.    이에 대한 결과는 auth, authError에서 확인가능   
    */
    const onSubmit = (e) => {
        e.preventDefault();        
        const {userid, userpwd, username, userpwdConfirm, address, phonenumber, email } = form;  

        const isAddrOK = isValueOK(address);
        const isPhoneOK = isValueOK(phonenumber);
        
        // 비번확인 체크
        if (userpwd !== userpwdConfirm) 
            return setError('비밀번호를 확인해주세요.');

        // 아이디, 비번, 이름, 이메일, 주소, 연락처 체크
        if (!userid) 
            return setError('아이디를 입력해주세요')
        else if (!userpwd && !isUpdateForm)  
            return setError('비밀번호를 입력해주세요')
        else if (!username) 
            return setError('이름을 입력해주세요.')
        else if (!email) 
            return setError('이메일을 입력해주세요.')        
        else if (!isAddrOK) 
            return setError('주소 입력 부분을 확인해주세요.')
        else if (!isPhoneOK)
            return setError('연락처 입력 부분을 확인해주세요.');
        
        if (!isUpdateForm) 
            dispatch(register({userid, userpwd, username, address, phonenumber, email}))
        else {
            if (user && user.data && user.data.id) {
                dispatch(updUserInfo({id: user.data.id, userid, userpwd, username, address, phonenumber, email}));
                history.goBack();
            }
        }                
    };

    // Error 문구 일정시간 지나면 사라짐
    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setError('');
            }, 2000);
        }
    }, [error])

    // 컴포넌트가 처음 렌더링될 때 초기화.
    useEffect(() => {                
        dispatch(initializeAuthForm({form: 'register'}));        
        
        // 회원정보 수정일 시 정보 가져옴
        if (isUpdateForm && user && user.data && user.data.id) {            
            dispatch(getUserInfo({id: user.data.id}));
        }
    }, [dispatch, user, isUpdateForm]);

    // 주소 API 사용하여 주소 관련 Input Change
    useEffect(() => {
        if (addressType !== "register") return;        
        const { zonecode, address, buildingName, bname, } = addressResult;
        if (!zonecode && !address && !buildingName && !bname) return;

        const setExtraAddress = (aBuildingName, aBname) => {
            let result = '';
            if (aBname) 
                result += aBname;
            if (aBuildingName) {
                result += 
                    result !== ''
                    ? `, ${aBuildingName}`
                    : aBuildingName;
            }
            if(result) result = `(${result})`;

            return result;
        };
        const extraAddress = setExtraAddress(buildingName, bname);
        /*
        // let fullAddress는 (기본주소 + 법정동/리 이름 + 건물명)             
        const fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';  
        */

        dispatch(changeField({
            form: 'register',
            key: 'address',
            value: zonecode,
            addKey: 'addressPostNo',
        }));

        dispatch(changeField({
            form: 'register',
            key: 'address',
            value: address,
            addKey: 'addressAddr1',
        }));

        if (extraAddress) {
            dispatch(changeField({
                form: 'register',
                key: 'address',
                value: extraAddress,
                addKey: 'addressAddr2',
            }));
        }

    }, [dispatch, addressResult, addressType]);

    // 회원가입 성공 or 실패 처리
    useEffect(()=> {                     
        if (isUpdateForm) return;

        if (authError) {
            const {data, status} = authError;           

            if (status === 409 || status === 500) {
                setError(data.message);                
            }
            return;
        }

        if (auth) {
            const {success} = auth;            
            success && console.log('회원가입 성공');   
            
            const {userid, userpwd} = form;
            dispatch(login({userid, userpwd}));
            dispatch(check());
        }
    }, [auth, authError, dispatch, form, isUpdateForm])

    // 회원가입 성공 후, 유저 체크
    useEffect(() => {
        if (user && !isUpdateForm) {
            history.push('/');
            
            // 로그인 상태 유지하기위해 브라우저에 내장되어있는 localStorage 사용
            try {                
                localStorage.setItem('user', JSON.stringify(user));                
            } catch (error) {
                console.log('localStorage is not working');
            }
        }
    }, [history, user, isUpdateForm]);

    return (
        <LoginRegisterTemplate
            type = "register"
            onSubmit = {onSubmit}
            onChange = {onChange}
            form = {form}
            error = {error}
            phoneFrontList={phoneFrontList}
            isUpdateForm={isUpdateForm}
        />
    );
};

export default withRouter(RegisterContainer);
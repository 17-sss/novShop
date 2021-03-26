import React from 'react';
import { Link } from 'react-router-dom';
import { ClearEx } from '../common/StyleUtilModels';
import {
    StyleAuthWrapper as LoginRegisterTemplateWrapper,
    StyleAuthMultiWrapper as LoginRegisterMultiWrapper,
    StyleAuthForm as LoginRegisterForm,
    StyleAuthInput as LoginRegisterInput,
    StyleAuthSelect as LoginRegisterSelect,
    StyleAuthBtn as LoginRegisterBtn,
    StyleAuthPageName as LoginRegisterPageName,
    LinkFooter,
    ErrorMessage,
} from '../common/StyleAuthComponents';
import PostNoSearchBtnContainer from '../../containers/common/PostNoSearchBtnContainer';


const objType = {
    login: '로그인',
    register: '회원가입',
}

const LoginRegisterTemplate = (props) => {
    const {type, onSubmit, onChange, form, error, phoneFrontList, isUpdateForm } = props;
    const typeValue = isUpdateForm ? '정보 수정' : objType[type];
    
    return (
        <>
            <LoginRegisterPageName>
                <p id="pageType">
                    {type === 'register'
                        ? isUpdateForm
                            ? '회원정보 수정'
                            : '회원가입'
                        : '로그인'}
                </p>
            </LoginRegisterPageName>

            <LoginRegisterTemplateWrapper>
                <LoginRegisterForm onSubmit = {onSubmit}>                                        
                    
                    <LoginRegisterMultiWrapper type={type}>
                        {type==="register" &&
                            <p className="p_cation">
                                기본정보
                            </p>
                        }
                        <div className="align_center">
                            <LoginRegisterInput        
                                autoComplete="off"    
                                name="userid" 
                                placeholder="아이디" 
                                type="text"
                                onChange={onChange}
                                value={form.userid}
                                size="60"
                                readOnly={isUpdateForm}
                            />
                            <br/>
                            <LoginRegisterInput     
                                autoComplete="off"
                                name="userpwd"
                                placeholder="비밀번호"
                                type="password"
                                onChange={onChange}
                                value={form.userpwd}
                                size="60"
                            />
                            <br/>
                            {(type === "register") &&
                                <LoginRegisterInput                         
                                    autoComplete="off"
                                    name="userpwdConfirm"
                                    placeholder="비밀번호 확인"
                                    type="password"
                                    onChange={onChange}
                                    value={form.userpwdConfirm}
                                    size="60"
                                />
                            }
                        </div>
                    </LoginRegisterMultiWrapper>
                                          
                    {(type === "register") && 
                    <>                        
                        <LoginRegisterMultiWrapper>
                            <p className="p_cation">
                                이름 {'&'} 이메일
                            </p> 
                            <div className="align_center">
                                <LoginRegisterInput                         
                                    autoComplete="off"      
                                    name="username"
                                    placeholder="이름"
                                    type="text"
                                    onChange={onChange}
                                    value={form.username}
                                    size="60"
                                /> 
                                <br/>
                                <LoginRegisterInput                         
                                    autoComplete="off"      
                                    name="email"
                                    placeholder="이메일"
                                    type="email"
                                    onChange={onChange}
                                    value={form.email}    
                                    size="60"                        
                                />   
                            </div>
                            <br/>
                        </LoginRegisterMultiWrapper>

                        <LoginRegisterMultiWrapper>
                            <p className="p_cation">
                                연락처
                            </p>
                            <div className="align_center">
                                <LoginRegisterSelect
                                    style={{padding: "0 10px"}}
                                    name="phoneNumSelect"
                                    onChange={onChange}
                                    value={form.phonenumber.phoneNumSelect}
                                >
                                    {phoneFrontList && phoneFrontList.map((v, i) => (
                                        <option value={v} key={i}>
                                            {v}
                                        </option>
                                    ))}
                                </LoginRegisterSelect>
                                -
                                <LoginRegisterInput
                                    txtAlign={"center"}
                                    name="phoneNum1"
                                    type="text"
                                    onChange={onChange}
                                    value={form.phonenumber.phoneNum1}
                                    maxLength="4"
                                    size="20"                            
                                />
                                -
                                <LoginRegisterInput
                                    txtAlign={"center"}
                                    name="phoneNum2"
                                    type="text"
                                    onChange={onChange}
                                    value={form.phonenumber.phoneNum2}
                                    maxLength="4"
                                    size="20"
                                />
                            </div>      
                            <br />                     
                        </LoginRegisterMultiWrapper>
                        
                        <LoginRegisterMultiWrapper>
                            <p className="p_cation">
                                주소
                            </p> 
                            <div className="align_center">
                                <LoginRegisterInput                                                                  
                                    name="addressPostNo"                                
                                    type="text"
                                    placeholder="우편번호"
                                    onChange={onChange}
                                    value={form.address.addressPostNo}
                                    size="47"
                                    readOnly="1"                                
                                />
                                &nbsp;
                                {/* 우편번호 검색 API용 Container */}
                                <PostNoSearchBtnContainer
                                    typeId={'register'}
                                />
                                {/* -- */}
                                <br />
                                <LoginRegisterInput
                                    name="addressAddr1"
                                    type="text"
                                    placeholder="기본주소"
                                    onChange={onChange}
                                    value={form.address.addressAddr1}
                                    size="60"                                
                                    readOnly="1"
                                />
                                <br />
                                <LoginRegisterInput
                                    name="addressAddr2"
                                    type="text"
                                    placeholder="나머지주소 (선택입력가능)"
                                    onChange={onChange}
                                    value={form.address.addressAddr2}
                                    size="60"                                   
                                />    
                            </div>                                                    
                        </LoginRegisterMultiWrapper>
                    </>
                    }

                    {error && <ErrorMessage>{error}</ErrorMessage>}                    
                    <ClearEx />

                    <LoginRegisterBtn>
                        {typeValue}
                    </LoginRegisterBtn>                        
                    
                    {!isUpdateForm && (
                        <LinkFooter>
                            <Link
                                style={{ color: 'rgb(50, 50 ,50)' }}
                                to={
                                    type === 'login'
                                        ? '/auth/register'
                                        : '/auth/login'
                                }
                            >
                                {type === 'login' ? '회원가입' : '로그인'}
                            </Link>
                        </LinkFooter>
                    )}
                    
                </LoginRegisterForm>
            </LoginRegisterTemplateWrapper>
        </>
    );
};

export default LoginRegisterTemplate;
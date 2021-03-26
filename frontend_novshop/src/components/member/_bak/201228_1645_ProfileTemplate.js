import React from 'react';
import { ClearEx } from '../../common/StyleUtilModels';
import {
    StyleAuthWrapper as ProfileTemplateWrapper,
    StyleAuthMultiWrapper as ProfileMultiWrapper,
    StyleAuthForm as ProfileForm,
    StyleAuthInput as ProfileInput,
    StyleAuthSelect as ProfileSelect,
    StyleAuthBtn as ProfileBtn,
    StyleAuthPageName as ProfilePageName,    
    ErrorMessage,
} from '../../common/StyleAuthComponents';
import PostNoSearchBtnContainer from '../../../containers/common/PostNoSearchBtnContainer';

const ProfileTemplate = (props) => {
    const { form, events, etc } = props;
    const { onSubmit, onChange } = events;
    const { phoneFrontList, errMessage } = etc;

    return (
        <div>
            <ProfilePageName>
                <p id="pageType">회원정보 수정</p>
            </ProfilePageName>

            <ProfileTemplateWrapper>
                <ProfileForm onSubmit={onSubmit}>
                    <ProfileMultiWrapper type={''}>
                        <p className="p_cation">기본정보</p>

                        <div className="align_center">
                            <ProfileInput
                                autoComplete="off"
                                name="userid"
                                placeholder="아이디"
                                type="text"
                                onChange={onChange}
                                value={form.userid}
                                size="60"
                            />
                            <br />
                            <ProfileInput
                                autoComplete="off"
                                name="userpwd"
                                placeholder="비밀번호"
                                type="password"
                                onChange={onChange}
                                value={form.userpwd}
                                size="60"
                            />
                            <br />

                            <ProfileInput
                                autoComplete="off"
                                name="userpwdConfirm"
                                placeholder="비밀번호 확인"
                                type="password"
                                onChange={onChange}
                                value={form.userpwdConfirm}
                                size="60"
                            />
                        </div>
                    </ProfileMultiWrapper>

                    <ProfileMultiWrapper>
                        <p className="p_cation">이름 {'&'} 이메일</p>
                        <div className="align_center">
                            <ProfileInput
                                autoComplete="off"
                                name="username"
                                placeholder="이름"
                                type="text"
                                onChange={onChange}
                                value={form.username}
                                size="60"
                            />
                            <br />
                            <ProfileInput
                                autoComplete="off"
                                name="email"
                                placeholder="이메일"
                                type="email"
                                onChange={onChange}
                                value={form.email}
                                size="60"
                            />
                        </div>
                        <br />
                    </ProfileMultiWrapper>

                    <ProfileMultiWrapper>
                        <p className="p_cation">연락처</p>
                        <div className="align_center">
                            <ProfileSelect
                                style={{ padding: '0 10px' }}
                                name="phoneNumSelect"
                                onChange={onChange}
                                value={form.phonenumber.phoneNumSelect}
                            >
                                {phoneFrontList &&
                                    phoneFrontList.map((v, i) => (
                                        <option value={v} key={i}>
                                            {v}
                                        </option>
                                    ))}
                            </ProfileSelect>
                            -
                            <ProfileInput
                                txtAlign={'center'}
                                name="phoneNum1"
                                type="text"
                                onChange={onChange}
                                value={form.phonenumber.phoneNum1}
                                maxLength="4"
                                size="20"
                            />
                            -
                            <ProfileInput
                                txtAlign={'center'}
                                name="phoneNum2"
                                type="text"
                                onChange={onChange}
                                value={form.phonenumber.phoneNum2}
                                maxLength="4"
                                size="20"
                            />
                        </div>
                        <br />
                    </ProfileMultiWrapper>

                    <ProfileMultiWrapper>
                        <p className="p_cation">주소</p>
                        <div className="align_center">
                            <ProfileInput
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
                            <PostNoSearchBtnContainer typeId={'register'} />
                            {/* -- */}
                            <br />
                            <ProfileInput
                                name="addressAddr1"
                                type="text"
                                placeholder="기본주소"
                                onChange={onChange}
                                value={form.address.addressAddr1}
                                size="60"
                                readOnly="1"
                            />
                            <br />
                            <ProfileInput
                                name="addressAddr2"
                                type="text"
                                placeholder="나머지주소 (선택입력가능)"
                                onChange={onChange}
                                value={form.address.addressAddr2}
                                size="60"
                            />
                        </div>
                    </ProfileMultiWrapper>

                    {errMessage && (
                        <ErrorMessage>{errMessage}</ErrorMessage>
                    )}
                    <ClearEx />

                    <ProfileBtn type="submit">수정</ProfileBtn>
                </ProfileForm>
            </ProfileTemplateWrapper>
        </div>
    );
};

export default ProfileTemplate;

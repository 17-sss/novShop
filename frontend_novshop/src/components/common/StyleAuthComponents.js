// 회원가입, 로그인, 프로필(회원정보 수정)에 사용되는 디자인들.
import styled, { css } from 'styled-components';
import { getSize } from '../../lib/utility/customFunc';

// ========================================================================================
// [1] Styled Auth, Login & Register & Profile
// ========================================================================================
// 1.1) Wrapper
const StyleAuthWrapper = styled.div`
    width: ${getSize(1.45)};
    margin: 0 auto;
`;

// 1.2) Multi Wrapper
const StyleAuthMultiWrapper = styled.div`
    width: ${(props) => props.width || '51%'};
    margin: 10px auto;

    ${(props) =>
        props.type !== 'login' &&
        css`
            border: 1px solid #eaeaea;
            padding: 10px;
            p.p_cation {
                font-size: 18px;
                color: gray;
                font-weight: bold;
            }
        `};
    div.align_center {
        text-align: center;
        justify-content: center;
    }
`;
// ---------------------------------------------------/

// 2) form
const StyleAuthForm = styled.form`
    width: 100%;
    padding: 0 ${getSize(30)} ${getSize(30)}; // 상 0, 좌우 & 하 ${getSize(30)}

    text-align: center;
    align-items: center;
    justify-content: center;
`;

// ---------------------------------------------------/

// 3.1) css Input, Select
const cssStyleAuthInputSelect = css`
    margin: 5px 0;
    border: none;
    border-bottom: 1px solid rgb(233, 233, 233);
    padding-bottom: 0.5rem;
    outline: none;

    font-size: 16px;

    &:focus {
        border-bottom: 1px solid rgb(209, 209, 209);
    }
`;
// 3.2) Input
const StyleAuthInput = styled.input`
    ${cssStyleAuthInputSelect};
    text-align: ${(props) => (props.txtAlign ? props.txtAlign : 'left')};
`;
// 3.3) Select
const StyleAuthSelect = styled.select`
    ${cssStyleAuthInputSelect}
    min-height: 2.6rem;
`;

// ---------------------------------------------------/

// 4) Button
const StyleAuthBtn = styled.button`
    width: 30%;
    padding: 10px;
    margin-top: 2rem;
    border: none;

    &:hover {
        background-color: rgb(209, 209, 209);
    }
`;
// ---------------------------------------------------/

// 5) 페이지 Name Wrapper
const StyleAuthPageName = styled.div`
    width: 100%;
    min-height: 30px;
    margin: 50px 0 20px;
    border-bottom: 0;
    text-align: center;

    p#pageType {
        font-weight: 100;
        color: #222;
        font-size: 20px;
    }
`;
// ---------------------------------------------------/

// ========================================================================================
// [2] ETC
// ========================================================================================
// 1) LinkFooter, Link 이동
const LinkFooter = styled.div`
    width: 75%;
    margin-top: 3rem;
    text-align: right;
`;
// ---------------------------------------------------/

// 2) ErrorMessage
const ErrorMessage = styled.div`
    color: red;
    font-size: 14px;
    margin: 10px 0 0 0;
    text-align: center;
`;
// ---------------------------------------------------/

export {
    StyleAuthWrapper,
    StyleAuthMultiWrapper,
    StyleAuthForm,
    StyleAuthInput,
    StyleAuthSelect,
    StyleAuthBtn,
    StyleAuthPageName,
    LinkFooter,
    ErrorMessage,
};

import React from 'react';
import styled, { css } from 'styled-components';
import { getSize } from '../../lib/utility/customFunc';
import { cssCustomInput } from '../../components/common/StyleUtilCSS';
import { ClearEx } from '../../components/common/StyleUtilModels';
import QuillContainer from "../../containers/write/QuillContainer";

// [1] Write 템플릿 Wrapper
// 1) 최상위 Form
const WriteForm = styled.form`
    width: ${getSize(1.45)};
    margin: 0 auto;
    font-size: 11pt;
`;

// 2) 다용도 Wrapper
const WriteMultiWrapper = styled.div`
    ${(props) => {
        const { stype } = props;
        return stype === 'buttons'
            ? css`
                  float: right;
                  margin: 8px 0 12px;
              `
            : css`
                  width: 100%;
              `;
    }}
`;
// ---------------------------------------------------/

// [2] Input & SelectBox
// 1) input
const WriteInput = styled.input`
    ${cssCustomInput};
    font-size: 11pt;

    ${(props) =>
        (props.type === 'button' || props.type === 'submit') &&
        css`
            width: 60px;
            margin-left: 5px;
            display: block;
            float: left; // 상위 div에서 right 해준 후, 여기서 left하면 내가 원한 순으로 나옴
        `}
`;

// 2) select
const WriteSelectBox = styled.select`
    ${cssCustomInput};
    font-size: 11pt;
    display: inline-block;
    margin-left: 10px;
    width: 10%;
`;

// 2-1) option: select 태그의 option 태그
const StyledOpt = styled.option`
    color: ${(props) => props.noblack || 'black'};
`;

// 3) span
const WriteSpan = styled.span`
    ${cssCustomInput};
    font-size: 11pt;

    ${(props) => {
        const { stype } = props;
        return stype === 'user'
            ? css`                  
                  display: block;
                  float: right;
                  width: 20%;
              `
            : css`padding-bottom: 9px;`;
    }}
`;
// ---------------------------------------------------/

const WriteTemplate = (props) => {
    // editorState & onEditorStateChange는 Editor용
    const {
        events: { onChange, onSubmit },        
        datas: { writeForm },
    } = props;

    return (
        <WriteForm onSubmit={onSubmit} encType="multipart/form-data">
            {/* 1) 내용을 제외한 옵션들 */}
            <WriteMultiWrapper>
                {/* 게시판 선택 및 유저 표시 */}                
                <WriteSpan>
                    <b>게시판 선택: </b>
                    <WriteSelectBox
                        name="boardType"
                        onChange={onChange}
                        value={writeForm.boardType || ''}
                    >
                        <StyledOpt value={''} noblack disabled>
                            게시판 선택
                        </StyledOpt>
                        <StyledOpt value={'notice'}>공지사항</StyledOpt>
                        <StyledOpt value={'qa'}>고객지원</StyledOpt>
                    </WriteSelectBox>
                </WriteSpan>                
                {writeForm.userViewId && (
                    <WriteSpan stype="user">
                        <b>작성자: </b> &nbsp;
                        {writeForm.userViewId}
                    </WriteSpan>
                )}

                {/* 공지사항 & 고객지원 */}
                <WriteInput
                    type="text"
                    name="subject"
                    placeholder="제목"
                    value={writeForm.boardType && writeForm[writeForm.boardType].subject}
                    onChange={onChange}
                />
                {writeForm.boardType === 'qa' && (
                    <>
                        <WriteInput
                            type="text"
                            name="product"
                            placeholder="상품 선택"
                        />
                        <input hidden name="productId" type="text" />
                    </>
                )}
            </WriteMultiWrapper>
            
            {/* 2) 에디터 통합 - QuillContainer  */}
            <QuillContainer />
            
            {/* 3) 확인 & 취소 버튼 */}
            <WriteMultiWrapper stype="buttons">
                <WriteInput type="submit" value="확인" />
                <WriteInput type="button" value="취소" />
            </WriteMultiWrapper>
            <ClearEx />
        </WriteForm>
    );
};

export default WriteTemplate;

import React from 'react';
import styled, { css } from 'styled-components';
import { getSize } from '../../lib/utility/customFunc';
import { cssCustomInput } from '../../components/common/StyleUtilCSS';
import { ClearEx } from '../../components/common/StyleUtilModels';
import 'quill/dist/quill.snow.css';

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
        return stype === 'editor'
            ? // Editor (quill)
              css`
                  margin: 10px 0;
                  border: 1px solid rgb(233, 233, 233);

                  .ql-editor {
                      padding: 0;

                      /* 최소 크기 지정 */
                      min-height: 500px;
                      font-size: 1.125rem;
                      line-height: 1.5;
                  }
                  .ql-editor.ql-blank::before {
                      left: 0;
                  }
                  .ql-editor iframe {
                      pointer-events: none;
                  }
              `
            : stype === 'buttons'
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
const WirteInput = styled.input`
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
`;

// 2-1) option: select 태그의 option 태그
const StyledOpt = styled.option`
    color: ${(props) => props.noblack || 'black'};
`;

// 3) span: 작성자 정보(아이디) View
const WriteUserSpan = styled.span`
    ${cssCustomInput};
    font-size: 11pt;
    width: 20%;

    display: block;
    float: right;
`;
// ---------------------------------------------------/

const WriteTemplate = (props) => {
    // editorState & onEditorStateChange는 Editor용
    const {
        events: { onChange, onSubmit },
        refs: { quillElement, imageRef },
        datas: { writeForm },
    } = props;

    return (
        <WriteForm onSubmit={onSubmit} encType="multipart/form-data">
            <WriteMultiWrapper>
                <WirteInput
                    type="text"
                    name="subject"
                    placeholder="제목"
                    value={writeForm.subject}
                    onChange={onChange}
                />
                <WriteSelectBox
                    name="boardType"
                    onChange={onChange}
                    value={writeForm.boardType || ''}
                    addcss={css`
                        width: 30%;
                    `}
                >
                    <StyledOpt value={''} noblack disabled>
                        게시판 선택
                    </StyledOpt>
                    <StyledOpt value={'notice'}>공지사항</StyledOpt>
                    <StyledOpt value={'qa'}>고객지원</StyledOpt>
                </WriteSelectBox>
                {writeForm.userViewId && (
                    <WriteUserSpan>
                        <b>작성자: </b> &nbsp;
                        {writeForm.userViewId}
                    </WriteUserSpan>
                )}
            </WriteMultiWrapper>

            <WriteMultiWrapper stype="editor">
                <div ref={quillElement} />
            </WriteMultiWrapper>

            {/* 이미지 input :: hidden */}
            <input
                hidden
                name="image"
                type="file"
                onChange={onChange}
                ref={imageRef}
            />

            <WriteMultiWrapper stype="buttons">
                <WirteInput type="submit" value="확인" />
                <WirteInput type="button" value="취소" />
            </WriteMultiWrapper>
            <ClearEx />
        </WriteForm>
    );
};

export default WriteTemplate;

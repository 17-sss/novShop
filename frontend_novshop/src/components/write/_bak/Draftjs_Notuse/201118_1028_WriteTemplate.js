import React from 'react';
import styled, { css } from 'styled-components';
import { getSize } from '../../lib/utility/customFunc';
import { cssCustomInput } from '../../components/common/StyleUtilCSS';
import { ClearEx } from '../../components/common/StyleUtilModels';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// [1] Write 템플릿 Wrapper
// 1) 최상위 Form
const WriteForm = styled.form`
    width: ${getSize(1.45)};
    margin: 0 auto;
`;

// 2) 다용도 Wrapper
const WriteMultiWrapper = styled.div`
    ${(props) => {
        const { stype } = props;
        return stype === 'editor'
            ? // Editor (react-draft-wysiwyg)
              css`
                  .wrapper-class {
                      width: 100%;
                      margin: 10px auto;
                  }
                  .editor {
                      height: 500px !important;
                      border: 1px solid #f1f1f1 !important;
                      padding: 5px !important;
                      border-radius: 2px !important;
                  }
              `
            : stype === 'buttons'
            ? css`
                  float: right;
                  margin: 8px 0 12px;
              `
            : '';
    }}
`;
// ---------------------------------------------------/

// [2] Input & SelectBox
// 1) input
const WirteInput = styled.input`
    ${cssCustomInput};

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
`;

// 2-1) StyledOpt: select 태그의 option 태그
const StyledOpt = styled.option`
    color: ${(props) => props.noblack || 'black'};
`;
// ---------------------------------------------------/

const WriteTemplate = (props) => {
    // editorState & onEditorStateChange는 Editor용
    const { datas, etcDatas, events } = props;
    const { editorState } = datas;
    const { page } = etcDatas;
    const { onSelectBoxChange, onEditorStateChange } = events;

    

    return (
        <WriteForm onSubmit={() => alert('1')} encType="multipart/form-data">
            <WirteInput type="text" name="subject" placeholder="제목" />
            <WriteSelectBox
                name="boardname"
                onChange={onSelectBoxChange}
                value={page || ''}
                // onChange={onChange}
                // value={productForm.categoryId || 0}
            >
                <StyledOpt value={''} noblack disabled>
                    게시판 선택
                </StyledOpt>
                <StyledOpt value={'yes'}>테스트yes</StyledOpt>
                <StyledOpt value={'no'}>테스트no</StyledOpt>
                {/*                 
                {categories && 
                    categories.map((v)=>{
                        return (
                            <StyledOpt key={v.id} value={v.id}>
                                {v.displayValue}
                            </StyledOpt>
                        );
                    } 
                )} 
*/}
            </WriteSelectBox>
            <WriteMultiWrapper stype="editor">
                <Editor
                    // 에디터와 툴바 모두에 적용되는 클래스
                    wrapperClassName="wrapper-class"
                    // 에디터 주변에 적용된 클래스
                    editorClassName="editor"
                    // 툴바 주위에 적용된 클래스
                    toolbarClassName="toolbar-class"
                    // 툴바 설정
                    toolbar={{
                        // inDropdown: 해당 항목과 관련된 항목을 드롭다운으로 나타낼것인지
                        list: { inDropdown: true },
                        textAlign: { inDropdown: true },
                        link: { inDropdown: true },
                        history: { inDropdown: false },
                    }}
                    placeholder="내용을 작성해주세요."
                    // 한국어 설정
                    localization={{
                        locale: 'ko',
                    }}
                    // 초기값 설정
                    editorState={editorState}
                    // 에디터의 값이 변경될 때마다 onEditorStateChange 호출
                    onEditorStateChange={onEditorStateChange}
                />
            </WriteMultiWrapper>
            <WriteMultiWrapper stype="buttons">
                <WirteInput type="submit" value="확인" />
                <WirteInput type="button" value="취소" />
            </WriteMultiWrapper>
            <ClearEx />
        </WriteForm>
    );
};

export default WriteTemplate;

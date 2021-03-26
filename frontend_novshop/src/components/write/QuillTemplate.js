import React from 'react';
import styled from 'styled-components';
import 'quill/dist/quill.snow.css';

const EditorWrapper = styled.div`
    margin: 10px 0;
    border: 1px solid rgb(233, 233, 233);

    .ql-editor {
        padding: 0;

        /* 최소 크기 지정 */
        min-height: 500px;
    }
    .ql-editor.ql-blank::before {
        left: 0;
    }
    /*  // 추후 quill video resize 모듈 사용시 활성
    .ql-editor iframe {
        pointer-events: none;
    }
    */
`;
// ---------------------------------------------------/


const WriteTemplate = (props) => {    
    const {
        events: { onChangeImage },
        refs: { quillElement, imageRef },       
    } = props;

    return (
        <>
            <EditorWrapper>
                <div ref={quillElement} />
            </EditorWrapper>

            {/* 이미지 input :: hidden */}
            <input
                hidden
                name="image"
                type="file"
                onChange={onChangeImage}
                ref={imageRef}
            />
        </>
    );
};

export default WriteTemplate;

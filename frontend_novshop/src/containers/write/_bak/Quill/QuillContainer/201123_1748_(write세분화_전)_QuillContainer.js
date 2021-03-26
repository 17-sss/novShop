import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {    
    imageUpload,
    initializeWriteForm,
    changeWriteForm,
} from '../../modules/write';
import QuillTemplate from "../../components/write/QuillTemplate";

import Quill from 'quill';
import {ImageDrop} from 'quill-image-drop-module';
import QuillResize from 'quill-resize-module';

// Quill 에디터 확장
Quill.register('modules/imageDrop', ImageDrop);         // 1# image-drop
Quill.register('modules/resize', QuillResize);          // 2# resize (image)
// [FIX PLZ] 3# resize (video) :: 추후 추가하길. eject 사용해서 옵션 수정해야하기에.. 


const QuillContainer = () => {
    const {writeImgName} = useSelector(({write}) => {
        return {
            writeImgName: write.writeImgName,
        }
    });
    const dispatch = useDispatch();

    // state & ref @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    const [file, setFile] = useState(null);

    // 1. 에디터 (quill) 관련
    const quillElement = useRef(null);  // Quill을 적용할 Div틀 전용
    const quillInstance = useRef(null); // Quill 인스턴스 설정
    const imageRef = useRef(null);      // Quill 이미지 전용 (input hidden)

    // hooks & events @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // 1. useCallback & event ----------------------------------------------------------
    // 1) onClickImageBtn (quill 이미지 핸들링을 위한 이벤트) (useCallback)
    const onClickImageBtn = useCallback(() => {
        imageRef.current.click();
    }, []);

    // 1-1) onChangeImage
    const onChangeImage = (e) => {
        e.preventDefault();
        const { type, files } = e.target;

        if (type === "file") {
            setFile(files[0])
        } else {
            return;
        }
    };

    // 2) 
    const onChangeWriteForm = useCallback(
        ({ key, value }) => {
            dispatch(changeWriteForm({ key, value }));
        },
        [dispatch],
    );

    // 2. useEffect ----------------------------------------------------------    
    // 1) Editor 설정
    useEffect(() => {
        // https://quilljs.com/docs/modules/toolbar/ 참고
        const toolbarOptions = [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            ['blockquote', 'code-block', 'link', 'image', 'video'],

            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
            [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
            [{ direction: 'rtl' }], // text direction

            [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
            [{ header: [1, 2, 3, 4, 5, 6, false] }],

            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ font: [] }],
            [{ align: [] }],

            ['clean'], // remove formatting button
        ];

        quillInstance.current = new Quill(quillElement.current, {
            theme: 'snow',
            placeholder: '내용을 입력해주세요.',
            modules: {
                toolbar: toolbarOptions,
                resize: {           // 확장: quill-resize-module   
                    modules: [ 'Resize', 'DisplaySize', /* 'Toolbar' */ ],     
                }, 
            },
            imageDrop: true,    // 확장: quill-image-drop-module
            
        });

        // quill에 text-change 이벤트 핸들러 등록
        // 참고: https://quilljs.com/docs/api/#events
        const quill = quillInstance.current;

        // 텍스트 입력시
        quill.on('text-change', (delta, oldDelta, source) => {
            if (source === 'user') {
                onChangeWriteForm({
                    key: 'content',
                    value: quill.root.innerHTML,
                });
            }
        });

        // 이미지 핸들링을 위한 커스텀 핸들러
        const toolbar = quill.getModule('toolbar');
        toolbar.addHandler('image', onClickImageBtn);
    }, [onChangeWriteForm, onClickImageBtn]);
    
    // 3-1-1) Editor 이미지 전용 State(file)이 변경될 시.
    useEffect(() => {
        if (!file) return;
        dispatch(imageUpload({ imgData: file }));
    }, [dispatch, file])

    // 3-1-2) Editor 이미지 전용 writeImgName 상태가 변경될 시
    useEffect(() => {
        if (!writeImgName || !writeImgName.data) return;
        if (typeof writeImgName.data !== "string")  return;

        quillInstance.current.root.innerHTML =
            quillInstance.current.root.innerHTML +
            `<img src="http://localhost:3000/uploads/${writeImgName.data}"/>`;

        dispatch(initializeWriteForm({form: 'writeImgName'}));
    }, [writeImgName, dispatch]);


    // ==============================================================================
    // ==============================================================================

    return (
        <QuillTemplate
            events={{ onChangeImage }}
            refs={{ quillElement, imageRef }}            
        />
    );
};

export default QuillContainer;

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    initializeWrite,
    changeWriteForm,
    createWriteNotice,
    createWriteQA,
    imageUpload,
    initializeWriteForm,
} from '../../modules/write';

import Quill from 'quill';
import {ImageDrop} from 'quill-image-drop-module';
import QuillResize from 'quill-resize-module';
import WriteTemplate from '../../components/write/WriteTemplate';

// Quill 에디터 확장
Quill.register('modules/imageDrop', ImageDrop);         // 1# image-drop
Quill.register('modules/resize', QuillResize);          // 2# resize (image)
// [FIX PLZ] 3# resize (video) :: 추후 추가하길. eject 사용해서 옵션 수정해야하기에.. 


const WriteContainer = (props) => {
    const { match } = props;
    const { params } = match;
    const { opt: page } = params;

    // redux 초기설정
    const dispatch = useDispatch();
    const { writeForm, writeImgName, userData } = useSelector(({ write, user }) => {
        return {
            writeForm: write.writeForm,
            writeImgName: write.writeImgName,
            userData: user.user,
        };
    });

    // state & ref @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    const [user, setUser] = useState(null);
    const [file, setFile] = useState(null);

    // 1. 에디터 (quill) 관련
    const quillElement = useRef(null);  // Quill을 적용할 Div틀 전용
    const quillInstance = useRef(null); // Quill 인스턴스 설정
    const imageRef = useRef(null);      // Quill 이미지 전용 (input hidden)

    // hooks & events @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // 1. useCallback & event ----------------------------------------------------------
    // 1) writeForm Change (useCallback)
    const onChangeWriteForm = useCallback(
        ({ key, value }) => {
            dispatch(changeWriteForm({ key, value }));
        },
        [dispatch],
    );

    // 1-1) writeForm Change
    const onChange = (e) => {
        e.preventDefault();
        const { name: key, value, type, files } = e.target;

        if (type === "file") {
            setFile(files[0])
        } else {
            onChangeWriteForm({ key, value });
        }
    };

    // 2) Submit
    const onSubmit = useCallback(
        (e) => {
            e.preventDefault();
            if (!writeForm) return;

            const { userId, subject, content, boardType } = writeForm;
            if (!boardType) return;

            switch (boardType) {
                case 'notice':
                    return dispatch(
                        createWriteNotice({ userId, subject, content }),
                    );
                case 'qa':
                    return dispatch(
                        createWriteQA({
                            userId,
                            productId: 1,
                            subject,
                            content,
                            picture: '',
                        }),
                    );
                default:
                    break;
            }
        },
        [dispatch, writeForm],
    );

    // 3) onClickImageBtn (quill 이미지 핸들링을 위한 이벤트) (useCallback)
    const onClickImageBtn = useCallback(() => {
        imageRef.current.click();
    }, []);

    // 2. useEffect ----------------------------------------------------------
    // 1) 현재 유저 GET
    useEffect(() => {
        if (!userData) return;
        if (typeof userData === 'object') {
            setUser(userData.user);
            user &&
                dispatch(changeWriteForm({ key: 'userId', value: user.id }));
            user &&
                dispatch(
                    changeWriteForm({ key: 'userViewId', value: user.userid }),
                );
        }
    }, [userData, user, dispatch]);

    // 2) 페이지 초기화
    useEffect(() => {
        dispatch(initializeWrite({ page }));
    }, [dispatch, page]);

    // 3) Editor 설정
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
        <WriteTemplate
            events={{ onChange, onSubmit }}
            refs={{ quillElement, imageRef }}
            datas={{ writeForm }}
        />
    );
};

export default withRouter(WriteContainer);

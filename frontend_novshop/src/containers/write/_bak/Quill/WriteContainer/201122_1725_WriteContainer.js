import React, { useCallback, useEffect, useState, useRef } from 'react';
import Quill from 'quill';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    initializeWrite,
    changeWriteForm,
    createWriteNotice,
    createWriteQA,
} from '../../modules/write';

import WriteTemplate from '../../components/write/WriteTemplate';

const WriteContainer = (props) => {
    const { match } = props;
    const { params } = match;
    const { opt: page } = params;

    // redux 초기설정
    const dispatch = useDispatch();
    const { writeForm, userData } = useSelector(({ write, user }) => {
        return {
            writeForm: write.writeForm,
            userData: user.user,
        };
    });

    // state & ref @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    const [user, setUser] = useState(null);

    // 1. 에디터 (quill) 관련
    const quillElement = useRef(null); // Quill을 적용할 Div틀 전용
    const quillInstance = useRef(null); // Quill 인스턴스 설정
    const quillMounted = useRef(null); // Quill 기존 내용을 가져오기 위한 Ref

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
        const { name: key, value } = e.target;

        onChangeWriteForm({ key, value });
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

    // 3) onClickImageBtn (quill 이미지 핸들링을 위한 이벤트)
    const onClickImageBtn = () => {
        const input = document.createElement('input');

        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        /*
        input.onchange = () => {
            const file = input.files[0];
            const formData = new FormData();
            formData.append('image', file);

            const range = quillInstance.current.getSelection(true);
            console.log(range);
            axios.post('/api/image/upload', formData).then((res) => {
                if (res.data.uploaded) {
                    console.log(res.data.transforms[2].location);
                    quillInstance.current.insertEmbed(
                        range.index,
                        'image',
                        res.data.transforms[2].location,
                    );

                    // Move cursor to right side of image (easier to continue typing)
                    quillInstance.current.setSelection(range.index + 1);
                }
            });
        };
        */
    };

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
            },
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
    }, [onChangeWriteForm]);

    // 3-1) Editor 기존 내용을 가져오기 위한 Ref 설정 (mounted)
    useEffect(() => {
        if (writeForm.content === '' || quillMounted.current) return;
        quillMounted.current = true;
        quillInstance.current.root.innerHTML = writeForm.content;
    }, [writeForm.content]);

    // ==============================================================================
    // ==============================================================================

    return (
        <WriteTemplate
            events={{ onChange, onSubmit }}
            refs={{ quillElement }}
            datas={{ writeForm, quillElement }}
        />
    );
};

export default withRouter(WriteContainer);

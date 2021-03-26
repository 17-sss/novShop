import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    initializeWrite,
    changeWriteForm,
    createWriteNotice,
    createWriteQA,
} from '../../modules/write';
import WriteTemplate from "../../components/write/WriteTemplate";

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
    
    // hooks & events @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // 1. useCallback & event ----------------------------------------------------------
    // 1) writeForm Change (useCallback)
    const onChangeWriteForm = useCallback(
        ({ key, subkey, value } = { subkey: ''}) => {
            dispatch(changeWriteForm({ key, subkey, value }));
        },
        [dispatch],
    );

    // 1-1) writeForm Change
    const onChange = (e) => {
        e.preventDefault();        
        const { name, value } = e.target;

        name === 'boardType' ? 
            onChangeWriteForm({ key: name, value }) 
            : onChangeWriteForm({ key: writeForm.boardType, subkey: name, value });
    };

    // 2) Submit
    const onSubmit = useCallback(
        (e) => {
            e.preventDefault();
            if (!writeForm) return;

            const { notice, qa, boardType } = writeForm;
            if (!boardType) return;

            switch (boardType) {
                case 'notice': {
                    const {subject, content, userId} = notice;
                    return dispatch(
                        createWriteNotice({subject, content, userId}),
                    );
                }
                case 'qa': {
                    const {subject, content, userId, /* productId*/} = qa;
                    return dispatch(
                        createWriteQA({
                            subject,
                            content,
                            userId,
                            productId: 1,
                        }),
                    );
                }
                default:
                    break;
            }
        },
        [dispatch, writeForm],
    );

    // 2. useEffect ----------------------------------------------------------
    // 1) 현재 유저 GET
    useEffect(() => {
        if (!userData) return;
        if (typeof userData === 'object') {
            setUser(userData.data);
            writeForm.boardType && user &&
                dispatch(changeWriteForm({ key: writeForm.boardType, subkey: 'userId', value: user.id }));                
            user &&
                dispatch(
                    changeWriteForm({ key: 'userViewId', value: user.userid }),
                );
        }
    }, [userData, user, dispatch, writeForm.boardType]);

    // 2) 페이지 초기화
    useEffect(() => {
        dispatch(initializeWrite({ page }));
    }, [dispatch, page]);

    // ==============================================================================
    // ==============================================================================

    return (
        <WriteTemplate
            events={{ onChange, onSubmit }}
            datas={{ writeForm, userData: user ? user : null }}
        />
    );
};

export default withRouter(WriteContainer);

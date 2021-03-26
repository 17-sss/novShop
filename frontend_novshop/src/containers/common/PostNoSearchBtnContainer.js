// 우편번호 검색 기능
// https://www.npmjs.com/package/react-daum-postcode
// http://postcode.map.daum.net/guide#attributes

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setAddressType, setAddressResult, initializeUtil, initializeUtilForm } from "../../modules/util";

import PostNoSearchBtn from '../../components/common/PostNoSearchBtn';

const PostNoSearchBtnContainer = (props) => {
    // [1] 기본값 지정 관련, typeId는 어디에 들어가야하는지 알기위해 만든 값. container에서만 씀
    const { children, typeId } = props;

    const dispatch = useDispatch();
    const { addressResult } = useSelector(({util}) => {
        return {        
            addressType: util.addressType,
            addressResult: util.addressResult,
        };        
    });              
    const [isShowModal, setIsShowModal] = useState(false);     
    // --------------|   

    // [2] 이벤트
    // 1) onComplete, DaumPostcode의 onComplete
    const onComplete = (data) => {
        if (typeof data === 'object') {
            // 만약 addressResult에 값 있으면 초기화
            if (addressResult && typeof addressResult === 'object') {
                let bFlag = false;
                for (const key in addressResult) {
                    const value = addressResult[key];
                    if(value) {
                        bFlag = true; 
                        break;
                    }
                }
                if (bFlag)                         
                    dispatch(initializeUtilForm({form: "addressResult"}));                    
            }
            // --

            const {zonecode, address, buildingName, bname} = data;   
            let bFlag = true;

            for (const key in data) {
                if (key === 'zonecode' || key === 'address') {
                    if (!data[key]) {
                        bFlag = false;
                        break;
                    }
                }
            }
            if (bFlag)
                dispatch(setAddressResult({zonecode, address, buildingName, bname}));
        }                    
    };

    // 2) onShowModal, 우편번호 검색 모달 보이기 상태
    const onShowModal = () => {                
        dispatch(setAddressType({type: typeId}));
        setIsShowModal(!isShowModal);        
    };  
    // --------------|
    
    // [3] useEffect
    // 1) 초기화
    useEffect(() => {     
        dispatch(initializeUtil());           
    }, [dispatch]);

    // 2) addressResult 값 있을시 모달 창 닫음
    useEffect(() => {
        if (addressResult && typeof addressResult === 'object') {
            let bFlag = false;
            for (const key in addressResult) {
                const value = addressResult[key];
                if(value) {
                    bFlag = true; 
                    break;
                }
            }
            bFlag && setIsShowModal(false);
        }        
    }, [addressResult])
    // --------------------------------------------------------------------------------------------    
    return (
        <PostNoSearchBtn            
            events={{
                onComplete,
                onShowModal,
            }}
            states={{ isShowModal }}                               
        >
            {children}
        </PostNoSearchBtn>
    );
};

export default PostNoSearchBtnContainer;

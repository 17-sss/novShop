// 우편번호 검색 기능
// https://www.npmjs.com/package/react-daum-postcode
// http://postcode.map.daum.net/guide#attributes

import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setAddressResult } from "../../modules/util";

import PostNoSearchBtn from '../../components/common/PostNoSearchBtn';

const PostNoSearchBtnContainer = (props) => {
    const { children } = props;    

    const dispatch = useDispatch();
    const { addressResult } = useSelector(({util}) => {
        return {
            addressResult: util.addressResult,
        };        
    });    

    // [1] 기본값 지정 관련    
    const initialStateResult = useMemo(() => {
        return {
            zonecode: null,             // 우편번호
            address: null,              // 기본주소
            buildingName: null,         // 건물명
            bname: null,                // 법정동/법정리 이름                
        }
    }, []);
    const [result, setResult] = useState(initialStateResult);
    const [isShowModal, setIsShowModal] = useState(false);     
    // --------------|   

    // [2] 이벤트
    // 1) onComplete, DaumPostcode의 onComplete
    const onComplete = (data) => {
        const {zonecode, address, buildingName, bname} = data;
        setResult({
            // ...result,
            zonecode,
            address,
            buildingName,
            bname,
        });        
    };

    // 2) onShowModal, 우편번호 검색 모달 보이기 상태
    const onShowModal = () => {
        setIsShowModal(!isShowModal);
    };  
    // --------------|
    
    // [3] useEffect
    // 1.1) 우편번호 검색 완료시
    useEffect(() => {
        if (typeof result === 'object') {            
            let bFlag = true;

            for (const key in result) {
                if (key === 'zonecode' || key === 'address') {
                    if (!result[key]) {
                        bFlag = false;
                        break;
                    }
                }
            }
            if (bFlag)  dispatch(setAddressResult({value: result}));      
        } else return;        
    }, [result, dispatch])

    // 1.2) 우편번호 검색 완료 후, 리덕스에 값 들어가면 useState result 초기화
    useEffect(() => {
        if (addressResult) {    // addressResult는 Redux 스토어 -> util.addressResult
            setResult(initialStateResult);
        } else return;
    }, [addressResult, initialStateResult])
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

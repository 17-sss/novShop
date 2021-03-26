// 우편번호 검색 기능
// https://www.npmjs.com/package/react-daum-postcode
// http://postcode.map.daum.net/guide#attributes

import React, { useState, useEffect, useMemo } from 'react';
import PostNoSearchBtn from '../../components/common/PostNoSearchBtn';

const PostNoSearchBtnContainer = (props) => {
    const { children, onComplete } = props;

    // [1] 기본값 지정 관련    
    const initialState = useMemo(() => {
        return {
            zonecode: null,             // 우편번호
            address: null,              // 기본주소
            buildingName: null,         // 건물명
            bname: null,                // 법정동/법정리 이름                
        }
    }, []);
    const [result, setResult] = useState(initialState);
    const [isShowModal, setIsShowModal] = useState(false);     
    // --------------|   

    // [2] 이벤트
    // 1) onDefaultComplete, DaumPostcode의 기본 onComplate
    const onDefaultComplete = (data) => {
        /*
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') { // addressType는 '검색된 기본 주소 타입'
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress +=
                    extraAddress !== ''
                        ? `, ${data.buildingName}`
                        : data.buildingName;
            }
            // let fullAddress는 (기본주소 + 법정동/리 이름 + 건물명)             
            fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';  
        }
        console.log(fullAddress); // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
        */
        setResult({
            ...result,
            zonecode: data.zonecode,       
            address: data.address,         
            buildingName: data.buildingName,
            bname: data.bname,            
        });        
    };

    // 2) onShowModal, 우편번호 검색 모달 보이기 상태
    const onShowModal = () => {
        setIsShowModal(!isShowModal);
    };  
    // --------------|
    
    // [3] useEffect
    // 1) 우편번호 검색 완료시
    useEffect(() => {
        if (typeof result === 'object') {
            console.log(result);
            // setResult(initialState);
        } else return;        
    }, [result])
    // --------------------------------------------------------------------------------------------

    return (
        <PostNoSearchBtn
            events={{
                onComplete: onDefaultComplete || onComplete,
                onShowModal,
            }}
            states={{ isShowModal }}
        >
            {children}
        </PostNoSearchBtn>
    );
};

export default PostNoSearchBtnContainer;

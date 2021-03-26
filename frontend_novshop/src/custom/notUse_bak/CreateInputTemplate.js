import React from 'react';
import styled from "styled-components";
import { MdAdd } from "react-icons/md";

// **********************************************************************************
// *** CreateInput : 다중 항목 생성용 input 컴포넌트 ***
// **********************************************************************************
const Input = styled.input`
    ${props => props.css && props.css}
    width: ${props => props.width && props.width};
`;

const CreateInput = (props) => {
    const {inputopt, value, onChange} = props;

    return (
        <Input 
            css = {inputopt.css}
            width = {inputopt.width || '100%'}                
            name = {inputopt.name || 'createinput'}
            placeholder = {inputopt.placeholder || '내용을 입력하세요'}  

            value = {value}                
            onChange = {onChange}                
        /> 
    )
};


// **********************************************************************************
// *** CreateInputResult : CreateInput에서 만든 Item
// **********************************************************************************
const ResultWrapper = styled.div`
    ${props => props.css && props.css}
    width: ${props => props.width ? props.width : "100%"};
`;

const CreateInputResult = (props) => {
    const {resultopt} = props;
    
    return (
        <ResultWrapper
            css = {resultopt.css}
            width = {resultopt.width}            
        >
            테스트
        </ResultWrapper>
    );
};


// **********************************************************************************
// *** CreateInputBtn : CreateInput 내용물 작성 후 전송버튼
// **********************************************************************************
const Button = styled.button`
    background: none;
    outline: none;
    border: none;

    ${props => props.css && props.css}
    width: ${props => props.width && props.width};
`;

const CreateInputBtn = (props) => {
    const {btnopt, onInsert} = props;

    return (
        <Button
            css = {btnopt.css}
            width = {btnopt.width || '10%'}
            type = 'button'
            onClick = {onInsert}
        >
            <MdAdd />
        </Button>
    );
}

export {CreateInput, CreateInputResult, CreateInputBtn};
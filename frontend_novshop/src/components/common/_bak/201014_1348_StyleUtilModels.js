import React, {useState} from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { useCalcMargin } from '../../lib/utility/customHooks';
import { getSize } from '../../lib/utility/customFunc';

import { Modal, InputGroup, FormControl, Button } from 'react-bootstrap';    // https://react-bootstrap.github.io/components/modal/
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';       // fas

// **********************************************************************************
// *** BoxModel (임시 레이아웃 채우기용..)  ***
// **********************************************************************************
const StyledBox = styled.div`
  background-color: ${(props) => props.backgroundColor || "rgb(69, 66, 105)"};  
  width: ${(props) => props.width === undefined ? "100%" : props.width};  
  padding: ${props => props.padding === undefined ? "20px 0" : props.padding};
  margin: ${props => props.margin === undefined ? "0" : props.margin};
`;

export const BoxModel = (props) => {
    return (
        <StyledBox {...props} />        
    );    

    /*  
    - BoxModel 컴포넌트를 만드는 과정에서
        {…props}를 StyledBox에 설정해주었는데
        이는 BoxModel이 받아 오는 props를 모두 StyledBox 전달한다는 의미.
    */
};


// **********************************************************************************
// *** 좌우 Margin  ***
// **********************************************************************************
const StyledMargin = styled.div`
    ${(props) => {
        if (props.MarginOption && props.MarginOption.margin) {
            if (props.MarginOption.vertScrollWidth) {
                let nLeft = props.MarginOption.margin;
                let nRight = (
                    props.MarginOption.margin -
                    props.MarginOption.vertScrollWidth
                );

                return css`
                    margin-left: ${nLeft + 'px'};
                    margin-right: ${nRight + 'px'};
                `;
            } else {
                return css`
                    margin: 0 ${props.MarginOption.margin + 'px'};
                `;
            }
        } else {
            return css`
                margin: 0 15%;
            `;
        }
    }}
`;

export const MarginBlock = (props) => {
    const MarginAndScroll = {
        margin: useCalcMargin(15),
        vertScrollWidth: undefined, /* useCalcVertScrollWidth(), 사용안하기로..*/
    };

    return (
        <StyledMargin MarginOption={MarginAndScroll}>
            {props.children}
        </StyledMargin>
    );
};

// **********************************************************************************
// *** 커스텀 Link  ***
// **********************************************************************************
export const CustomLink = styled(Link)`
    margin: ${(props) => props.margin || '0 5px'};
    color: ${props => props.color ? props.color : "rgb(0, 0, 0)"};
    font-size: ${(props) => props.fontSize && props.fontSize};

    text-decoration: ${(props) => props.textdeco ? "underline" : "none"};
    &:focus,
    &:hover,
    &:visited,
    &:link,
    &:active {
        text-decoration: ${(props) => props.textdeco ? "underline" : "none"}; 
        color: ${props => props.hcolor ? props.hcolor : "rgb(0, 0, 0)"};     
    }    
`;

// **********************************************************************************
// *** 커스텀 버튼 : 투명 ***
// **********************************************************************************
export const TransparentBtn = styled.button`
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;

    &:hover{
        color: ${props => props.hovercolor && props.hovercolor};
    }
`;


// **********************************************************************************
// *** ClearEx : clear 태그 Control ***
// **********************************************************************************
export const ClearEx = styled.div`
    ${(props) => {
        if ((props.opt === "left") || (props.opt === "right") || (props.opt === "both")) {
            return css`clear: ${props.opt};`;
        } else {
            return css`clear: both;`;
        }
    }}
`;


// **********************************************************************************
// *** StyledHr : 구분선 ***
// **********************************************************************************
export const StyledHr = styled.hr`
    width: ${getSize(1)};    
    position: relative; /* 굳이 없어도 되는거같지만.. 그래도? */
    margin: 0 auto;
`;


// **********************************************************************************
// *** BorderBotLine : border-bottom을 사용한 구분선 ***
// **********************************************************************************
export const BorderBotLine = styled.div`
    height: 1px;
    width: ${props => props.width ? props.width : getSize(1)};    
    margin: ${props => props.margin ? props.margin : "0 auto"};
    border-bottom: ${props => props.color ? ("1px solid " + props.color) : "1px solid #f6f6f6"};
`;


// Input 관련 START ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
// **********************************************************************************
// *** CustomInput ***
// **********************************************************************************
const StyledCustomInput = styled.input`
    ${props => {
        const {stylecss, addcss, type} = props;

        let defaultcss = '';
        switch (type) {
            case "color": {
                defaultcss = css`
                    width: 100%;
                    border: none;
                    height: 40px;
                    margin: 0;
                    padding: 0;
                `;
                break;
            }
        
            default: {
                defaultcss = css`
                    width: 100%;
                    margin-top: 1%;
                    padding-bottom: 0.5rem;
                    font-size: 16px;

                    border: none;
                    border-bottom: 1px solid rgb(233, 233, 233);
                    outline: none;

                    &:focus {
                        border-bottom: 1px solid rgb(209, 209, 209);
                    }
                `;
                break;
            }    
        }
        
        
        if (!stylecss) {
            if (addcss) return (defaultcss + addcss)
            else        return defaultcss;                        
        } else {
            if (addcss) return (stylecss + addcss)
            else        return stylecss;
        }

    }}
`;

export const CustomInput = (props) => {
    const {stylecss, addcss} = props;
    const {name, type, placeholder, onChange, min, max} = props;
    
    return (
        <StyledCustomInput              
            name = {name}    
            type = {type}
            placeholder = {placeholder}
            onChange = {onChange && onChange}
            min = {min && min}
            max = {max && max}

            stylecss = {stylecss && stylecss}  
            addcss = {addcss && addcss} 
        />
    );
};

// **********************************************************************************
// *** CustomInputOptionBtn : CustomInput에서 작성한 값들을 전송하는 버튼 
//      (배열, 다수의 값 등을 생성해야할때 사용) ***
// **********************************************************************************
const StyledCustomInputOptionBtn = styled.input`
    ${props => {
        const {stylecss, addcss} = props;

        const defaultcss = css`            
            border: none;
            font: inherit;
            cursor: pointer;
            outline: inherit;
            
            padding: 0.5rem;
            font-size: 16px;
            color: white;
            background-color: rgb(170, 170, 170);
            border-radius: 2px;

            &:hover {
                background-color: rgb(150, 150, 150);
            }  
        `;
        
        if (!stylecss) {
            if (addcss) return (defaultcss + addcss)
            else        return defaultcss;                        
        } else {
            if (addcss) return (stylecss + addcss)
            else        return stylecss;
        }
    }}
`;

export const CustomInputOptionBtn = (props) => {
    const {stylecss, addcss} = props;
    const {onClick, name, children} = props;

    return (
        <StyledCustomInputOptionBtn            
            type = 'button'
            onClick = {onClick}
            name = {name && name}
            value = {children || "+"}

            stylecss = {stylecss && stylecss}
            addcss = {addcss && addcss} 
        />        
    );
};

// **********************************************************************************
// *** CustomInputOptionResult : CustomInputOptionBtn으로 전송한 값들 ***
// **********************************************************************************
const StyledCustomInputOptionResult = styled.span`
    ${props => props.css || css`        
        font-size: 12px;
        margin: 0 10px 0 0;
    `};

    color: ${props => props.color && props.color};
    font-weight: bold;

    &:hover {
        cursor: pointer;
    }
`;

export const CustomInputOptionResult = (props) => {
    const {css, color, children, onClick} = props;

    return (
        <StyledCustomInputOptionResult
            css = {css && css}     
            color = {color && color}      
            onClick = {onClick && onClick}
        >
            {children}
        </StyledCustomInputOptionResult>
    );
};
// Input 관련 END ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒



// Dropdown 관련 START ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
// **********************************************************************************
// *** Dropdown : Content ***
// **********************************************************************************
export const DropdownContent = styled.div`
    background-color: white;

    display: none;
    position: absolute;    
    min-width: 180px;
    padding: 7px;
    margin: ${props => props.margin || "0 0 0 -5px"};
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);

    a {
        color: black; 
        padding: 0 3px;
        text-decoration: none; 
        display: block;
        font-size: 9pt;

        &:hover {
            background-color: rgb(249, 249, 249);
        }
    }
`;


// **********************************************************************************
// *** Dropdown : '최상위'에 쓸 용도 (css) ***
// **********************************************************************************
/* 
    - Dropdown을 하는 부모 태그가 어느 것이 될지 모르니 스타일컴포넌트 자체가 아닌 css로 만들어놓음.
    - 태그가 아닌 CSS로 만들어 놓고 사용하려는 스타일컴포넌트 변수에 등록하기.
*/
export const cssDropdown = css`
    position: relative;
    display: inline-block;
    z-index: 10;   

    &:hover {
        /* .dropdown:hover .dropdown-button { background-color: #CD853F; }  < 참고용 */


        /* .dropdown:hover .dropdown-content { display: block; } */
        ${DropdownContent} {
            display: block;            
        } 
    }
`;
// Dropdown 관련 END ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒


// Modal (Bootstrap) 관련 START ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒

// **********************************************************************************
// *** Modal : VerticalModal - 화면 중앙에 팝업되는 Modal (샘플용) ***
// **********************************************************************************
const VerticalModal = (props) => {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >            
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Modal heading
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Centered Modal</h4>
                <p>
                    Cras mattis consectetur purus sit amet fermentum. Cras justo
                    odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
                    risus, porta ac consectetur ac, vestibulum at eros.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <button onClick={props.onHide}>Close</button>
            </Modal.Footer> 
            
        </Modal>
    );
};


// **********************************************************************************
// *** Modal : SearchModal - 검색용 모달 ***
// **********************************************************************************
const SearchModal = (props) => {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <InputGroup>
                <FormControl
                    placeholder="검색어를 입력해주세요"                    
                    name="search" 
                />
                <InputGroup.Append>
                {/* 추후 submit 연구 */}
                    <form onSubmit = {() => console.log(11)}>                        
                        <Button type = "submit" variant="outline-secondary">
                            <FontAwesomeIcon icon={faSearch} size="lg" />
                        </Button>
                    </form>
                </InputGroup.Append>
            </InputGroup>

        </Modal> 
    );
}

// **********************************************************************************
// *** Modal: ModalBtn - Modal 실행 버튼 ***
// **********************************************************************************
export const ModalBtn = (props) => {
    const {children, mode} = props;
    const [modalShow, setModalShow] = useState(false);

    return (
        <>
            <TransparentBtn 
                hovercolor= "#007bff"
                variant="primary" 
                onClick={() => setModalShow(true)}
            >
                {children}
            </TransparentBtn>

            {mode === 'search' ? (
                <SearchModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                />
            ) : (
                <VerticalModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                />
            )}
          
        </>
    );
};
// Modal (Bootstrap) 관련 END ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
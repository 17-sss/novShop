import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { useCalcMargin } from '../../lib/utility/customHooks';
import { getSize } from '../../lib/utility/customFunc';

import { Modal, InputGroup, FormControl, Button } from 'react-bootstrap'; // https://react-bootstrap.github.io/components/modal/
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'; // fas

// **********************************************************************************
// *** BoxModel (임시 레이아웃 채우기용..)  ***
// **********************************************************************************
const StyledBox = styled.div`
    background-color: ${(props) => props.backgroundColor || 'rgb(69, 66, 105)'};
    width: ${(props) => (props.width === undefined ? '100%' : props.width)};
    padding: ${(props) =>
        props.padding === undefined ? '20px 0' : props.padding};
    margin: ${(props) => (props.margin === undefined ? '0' : props.margin)};
`;

export const BoxModel = (props) => {
    return <StyledBox {...props} />;

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
                let nRight =
                    props.MarginOption.margin -
                    props.MarginOption.vertScrollWidth;

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
        vertScrollWidth: undefined /* useCalcVertScrollWidth(), 사용안하기로..*/,
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
    color: ${(props) => (props.color ? props.color : 'rgb(0, 0, 0)')};
    font-size: ${(props) => props.fontSize && props.fontSize};
    text-decoration: ${(props) => (props.textdeco ? 'underline' : 'none')};
    &:hover {
        text-decoration: ${(props) => (props.textdeco ? 'underline' : 'none')};
        color: ${(props) => (props.hcolor ? props.hcolor : 'rgb(0, 0, 0)')};
    }
    /*
    &:focus,
    &:visited,
    &:link,
    &:active
    &:hover {
        text-decoration: ${(props) => (props.textdeco ? 'underline' : 'none')};
        color: ${(props) => (props.hcolor ? props.hcolor : 'rgb(0, 0, 0)')};
    }
    */
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

    &:hover {
        color: ${(props) => props.hovercolor && props.hovercolor};
    }
`;

// **********************************************************************************
// *** ClearEx : clear 태그 Control ***
// **********************************************************************************
export const ClearEx = styled.div`
    ${(props) => {
        if (
            props.opt === 'left' ||
            props.opt === 'right' ||
            props.opt === 'both'
        ) {
            return css`
                clear: ${props.opt};
            `;
        } else {
            return css`
                clear: both;
            `;
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
    width: ${(props) => (props.width ? props.width : getSize(1))};
    margin: ${(props) => (props.margin ? props.margin : '0 auto')};
    border-bottom: ${(props) =>
        props.color ? '1px solid ' + props.color : '1px solid #f6f6f6'};
`;

// **********************************************************************************
// *** Responsive : 반응형 활용 *** (추후 수정하여 사용하길)
// **********************************************************************************
const ResponsiveBlock = styled.div`
    padding-left: 1rem;
    padding-right: 1rem;
    width: 1024px;
    margin: 0 auto; /* 중앙 정렬 */

    /* 브라우저 크기에 따라 가로 크기 변경 */
    @media (max-width: 1024px) {
        width: 768px;
    }

    @media (max-width: 768px) {
        width: 1024px;
    }
`;

export const Responsive = ({ children, ...rest }) => {
    // style, className, onClick, onMouseMove 등의 props를 사용할 수 있도록
    // ...rest를 사용하여 ResponsiveBlock에게 전달
    return <ResponsiveBlock {...rest}> {children} </ResponsiveBlock>;
};


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
    margin: ${(props) => props.margin || '0 0 0 -5px'};
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);

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
                    <form onSubmit={() => console.log(11)}>
                        <Button type="submit" variant="outline-secondary">
                            <FontAwesomeIcon icon={faSearch} size="lg" />
                        </Button>
                    </form>
                </InputGroup.Append>
            </InputGroup>
        </Modal>
    );
};

// **********************************************************************************
// *** Modal: ModalBtn - Modal 실행 버튼 ***
// **********************************************************************************
export const ModalBtn = (props) => {
    const { children, mode } = props;
    const [modalShow, setModalShow] = useState(false);

    return (
        <>
            <TransparentBtn
                hovercolor="#007bff"
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

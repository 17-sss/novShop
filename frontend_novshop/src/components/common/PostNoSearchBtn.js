import React from 'react';
import styled from "styled-components";
import DaumPostcode from 'react-daum-postcode';
import { TransparentBtn } from '../common/StyleUtilModels';
import { Modal, Button } from 'react-bootstrap';

const PostNoBtn = styled(TransparentBtn)`    
    text-decoration: underline;
    color: #3c65fb;
    &:hover {
        color: #5d80fe;
    }
`;

const PostNoSearchBtn = (props) => {
    const { children, events, states } = props;
    const { onComplete, onShowModal } = events;
    const { isShowModal } = states;
    
    return (
        <>            
            <PostNoBtn type="button" onClick={onShowModal}>
                {children ? children : '우편번호 검색'}
            </PostNoBtn>

            <Modal
                show={isShowModal}
                onHide={onShowModal}                               
                centered
                // animation={false} 
                // size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        우편번호 검색
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DaumPostcode
                        onComplete={onComplete}                            
                        // { ...props }
                    />
                </Modal.Body>
                <Modal.Footer>                    
                    <Button variant="secondary" onClick={onShowModal}>닫기</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default PostNoSearchBtn;

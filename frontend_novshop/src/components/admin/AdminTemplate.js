import React from 'react';
import styled, {css} from 'styled-components';
import {Link} from 'react-router-dom';
import {TransparentBtn} from '../../components/common/StyleUtilModels'
import { getSize } from '../../lib/utility/customFunc';

const AdminWrapper = styled.div`
    width: ${getSize(1.45)};
    margin: 0 auto;
`;

const CreateLinkWrapper = styled.div`
    padding-top: ${getSize(10)};
    padding-bottom: ${getSize(7)}; 
    
    text-align: center;
    align-items: center;
    justify-content: center;
`;

const CSSLinkStyle = css`
    background-color: #ccc; 
    color: rgb(255, 255, 255);
    text-decoration: none;

    width: 200px;
    height: 100px;

    margin: 5px 5px;
    border-radius: 10px;
    
    &:focus,
    &:hover,
    &:visited,
    &:link,
    &:active {        
        text-decoration: none;
    }    
    
    &:hover {
        color: rgb(240, 240, 240);
    }
`;


const CreateLink = styled(Link)`
    display: inline-block;
    line-height: 100px;
    ${CSSLinkStyle}
`;

const CreateBtn = styled(TransparentBtn)`
    ${CSSLinkStyle}
`;


const AdminTemplate = (props) => {    
    const {onClickEvents} = props;
    const {onClickCreateCategories} = onClickEvents;

    return (
        <>
            <AdminWrapper>

                <CreateLinkWrapper>
                    <CreateLink to = '/admin/managecategory'>
                        카테고리 생성 폼
                    </CreateLink>                                        
                    <CreateLink to = '/admin/manageproduct'>
                        물품 생성 폼
                    </CreateLink>
                    <br/>
                    <CreateBtn onClick = {onClickCreateCategories}>
                        이미 정의된 카테고리 생성
                    </CreateBtn>
                </CreateLinkWrapper>

            </AdminWrapper>
        </>
    );
};

export default AdminTemplate;

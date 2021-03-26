import React from 'react';
import styled from 'styled-components';
import { getSize } from '../../lib/utility/customFunc';
import { CustomLink } from '../../components/common/StyleUtilModels';
import { Button } from 'react-bootstrap';

const AdminWrapper = styled.div`
    width: ${getSize(1)};
    height: ${getSize(1.5, 'height')};
    margin: 0 auto;
`;

const CreateBtnWrapper = styled.div`
    width: 100%;
    
    /* text-align: center; */
    /* align-items: center; */
    /* justify-content: center; */
`;

const CustomBtn = styled(Button)`
    margin: 0 10px;
`;

const AdminTemplate = (props) => {
    /*
    const { onClickEvents } = props;    
    const {
        onClickCreateCategories,
        onClickCreateProducts,
    } = onClickEvents;
    */

    return (
        <>
            <AdminWrapper>
                {/* 
                <button onClick={onClickCreateCategories}>
                    카테고리 리스트 생성
                </button>
                <br/>
                <button onClick={onClickCreateProducts}>
                    물품 생성
                </button> 
                */}
                <CreateBtnWrapper>
                    <CustomBtn variant="success">
                        <CustomLink to = '/admin/createcategory'>
                            카테고리 생성 폼
                        </CustomLink>                    
                    </CustomBtn>

                    <CustomBtn variant="success">
                        <CustomLink to = '/admin/createproduct'>
                            물품 생성 폼
                        </CustomLink>
                    </CustomBtn>
                </CreateBtnWrapper>
            </AdminWrapper>
        </>
    );
};

export default AdminTemplate;

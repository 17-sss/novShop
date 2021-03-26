import React from 'react';
import { withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { createCategory } from '../../modules/category';
import categoryList from '../../lib/data/categoryList.json';

import AdminTemplate from '../../components/admin/AdminTemplate';
import ManageForProductContainer from './ManageForProductContainer';

const AdminContainer = (props) => {
    const { match } = props;
    const ctrlpage = match.params.ctrlpage;

    const dispatch = useDispatch();
    const onClickCreateCategories = () => {
        try {
            categoryList.map((v) => {
                return dispatch(
                    createCategory({
                        key: v.key,
                        displayValue: v.value,
                        items: v.items,
                    }),
                );
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const onClickEvents = {
        onClickCreateCategories,
        // onClickCreateProducts,
    };

    // ** render **
    switch (ctrlpage) {
        case undefined:
            return <AdminTemplate onClickEvents={onClickEvents} />;
        case 'managecategory':
        case 'manageproduct':
            return <ManageForProductContainer ctrlpage = {ctrlpage} />;
        /*
        // 예) 같은 조건이 두개라면 아래와 같이 case쓰기
        case "createcategory":
        case "createproduct": {            
            return  <AdminCreateItemTemplate ctrlpage={ctrlpage} />; 
        } 
        */
        default:
            return <div>Admin - Default Page</div>;
    }
};

export default withRouter(AdminContainer);

import React from 'react';
import { withRouter } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { createCategory } from '../../modules/category';
import categoryList from '../../lib/data/categoryList.json';

import { createProduct } from '../../modules/product';
import productList from '../../lib/data/productList.json';

import AdminTemplate from '../../components/admin/AdminTemplate';

const AdminContainer = () => {
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

    const onClickCreateProducts = () => {
        try {
            productList.map((v) => {
                const {
                    itemName: name,
                    itemImage: image,
                    itemSize: sizes,
                    itemColors: colors,
                    price,
                    sale,
                    description,
                } = v;

                const data = {
                    name,
                    image,
                    sizes,
                    colors,
                    price,
                    sale,
                    description,
                    categorySub: 1, // 추후정의
                    categoryId: 1   // 추후정의
                };

                return dispatch(
                    createProduct(data),
                );
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const onClickEvents = {
        onClickCreateCategories,
        onClickCreateProducts,
    };

    return <AdminTemplate onClickEvents={onClickEvents} />;
};

export default withRouter(AdminContainer);

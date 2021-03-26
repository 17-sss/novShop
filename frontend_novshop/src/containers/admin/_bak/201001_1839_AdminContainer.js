import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategory, insertCategory } from '../../modules/category';
import categoryList from '../../lib/data/categoryList.json';    

import AdminTemplate from "../../components/admin/AdminTemplate";


const AdminContainer = () => {
    const dispatch = useDispatch();
    const {category, categoryError} = useSelector(({category}) => {
        return {
            category: category.category,
            categoryError: category.categoryError,
        }
    });
    
    const onClickCreateCategories = () => {
        try {
            categoryList.map( (v) => {                
                return dispatch(
                    insertCategory({
                        key: v.key,
                        value: v.value,
                        items: v.items,
                    })
                );
            })
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    const onClickGetAllCategories = () => {
        dispatch(getAllCategory());
    }

    useEffect(() => {
        const {data: arrayData} = category;
    
        if (arrayData) {
            // console.log(arrayData);
            
            arrayData.map((v, i) => {
                return console.log(
                    
                    v.key,
                    v.displayValue,
                    JSON.parse(v.items),
                );
            });
        }


        
    }, [category, categoryError])


    const onClickEvents = {
        onClickCreateCategories,
        onClickGetAllCategories,        
    }

    return (
        <AdminTemplate
            onClickEvents = {onClickEvents}
        />
    );
};

export default AdminContainer;

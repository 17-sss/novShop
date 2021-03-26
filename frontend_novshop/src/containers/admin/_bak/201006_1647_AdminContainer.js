import React from 'react';
import { withRouter } from "react-router-dom";

import AdminTemplate from '../../components/admin/AdminTemplate';
import AdminCreateItemTemplate from '../../components/admin/AdminCreateItemTemplate';

const AdminContainer = (props) => {
    const {match} = props;
    const ctrlpage = match.params.ctrlpage;    

// input에 들어갈 값 정의 :: START
    const createNames = (Aname, Aplaceholder, Atype) => {
        return {
            name: Aname,
            placeholder: Aplaceholder,
            type: Atype,
        }
    };
    
    const names = [];
    switch (ctrlpage) {
        case "createcategory": {
            names.push(
                createNames("key", "카테고리 키 (영문)", "text"), 
                createNames("displayValue", "실제 보일 값", "text"), 
                createNames("items", "소분류", "no")
            );
            break;
        }
        case "createproduct": {
            names.push(
                createNames("name", "상품명", "text"),
                createNames("image", "상품 이미지 경로 (불러오기)", "no"),
                createNames("sizes", "사이즈 (배열)"),
                createNames("colors", "색상정보 (배열)"),
                createNames("price", "가격"),
                createNames("sale", "세일가"),
                createNames("description", "부가설명"),
                createNames("categorySub", "카테고리 소분류 (id)"),
                createNames("categoryId", "카테고리 대분류 (id)"),
            );
            break;
        }
        default:
            break;
    }
// input에 들어갈 값 정의 :: END

// ** render **
    switch (ctrlpage) {        
        case undefined: {
            return  <AdminTemplate/>; 
        }

        case "createcategory":
        case "createproduct": {            
            return  <AdminCreateItemTemplate ctrlpage={ctrlpage} />; 
        }    
        default:
            break;
    }    
};

export default withRouter(AdminContainer);

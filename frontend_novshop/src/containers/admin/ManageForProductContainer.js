import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import {
    changeCategoryForm,
    createCategory,
    initializeCategory,
    initializeCategoryKey,
    delItemCategoryForm,
} from '../../modules/category';
import {
    changeProductForms,
    createProduct,
    initializeProduct,
    initializeProductKey,
    delItemProductForm,
    adminGetProduct, 
    adminUpdProduct,   
} from '../../modules/product';
import {replaceAll} from '../../lib/utility/customFunc';

import ManageForProductTemplate from '../../components/admin/ManageForProductTemplate';

const ManageForProductContainer = (props) => {
    const { ctrlpage, location } = props;
    const query = location && location.search ? queryString.parse(location.search) : '';
    const { itemId } = query;    

    const {
        // category, // ~: 전송이 완료된 경우
        categoryForm, // ~Form: 현재 작성하고 있는 값들
        categoryStatus, // 현재 데이터베이스에 있는 카테고리 정보들
        categoryError,
        product,
        productForm,
        productError,
    } = useSelector(({ category, product }) => {
        return {
            // category: category.category,
            categoryForm: category.categoryForm,
            categoryStatus: category.categoryStatus,
            categoryError: category.categoryError,
            product: product.product,
            productForm: product.productForm,
            productError: product.productError,
        };
    });
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState(null);
    const [file, setFile] = useState(null); // image 파일을 서버로 전송하기 위한 state
    const [errorMessage, setErrorMesssage] = useState('');

    const dispatch = useDispatch();

    // input onChange
    const onChange = (e) => {
        let { name, value, files } = e.target;
        if (!name) return; // 버튼에서 계속 name이 사라짐. (input type = 'button'로 하니까 해결됨)

        switch (ctrlpage) {
            case 'manageproduct': {
                switch (name) {
                    case 'image': {
                        // productForm.image는 그냥 보여지는 값일 뿐임. 서버엔 들어가지 않음.
                        // state - file이 들어감.
                        setFile(files[0]);
                        break;
                    }

                    case 'categoryId': {
                        let tmpCategory = null;
                        if (categories) {
                            if (
                                !productForm.categorySub ||
                                productForm.categorySub > 0
                            ) {
                                dispatch(
                                    initializeProductKey({
                                        form: 'productForm',
                                        key: 'categorySub',
                                    }),
                                );
                            }

                            tmpCategory = categories.filter((v) => {
                                return Number(v.id) === Number(value);
                            })[0];
                            setSubCategories(tmpCategory);
                        }
                        break;
                    }
                    default:
                        break;
                }
                
                return [
                    dispatch(
                        changeProductForms({
                            form: 'productForm',
                            key: name,
                            value,
                        }),
                    ),
                    name === 'insertSizes' &&
                        dispatch(initializeProductKey({ form: 'productForm', key: 'size' })),
                ];
            }
            case 'managecategory': {
                if (name === 'key' || name === 'itemKey') {
                    // 영문(대, 소문자), 숫자만 허용
                    let regType = /^[A-Za-z0-9+]*$/;
                    if (!regType.test(value))
                        return setErrorMesssage(
                            'key 값은 영문, 숫자만 입력할 수 있습니다.',
                        );
                }

                return [
                    dispatch(
                        changeCategoryForm({
                            key: name,
                            value, //: name === 'insertItems' ?  : value,
                        }),
                    ),
                    name === 'insertItems' && [
                        dispatch(initializeCategoryKey({ key: 'itemKey' })),
                        dispatch(initializeCategoryKey({ key: 'itemValue' })),
                    ],
                ];
            }
            default:
                break;
        }
    };

    // result(span) 배열적인 아이템 Delete(미완)
    const onDelete = (e) => {
        const { innerHTML, parentNode } = e.target;
        const delItem = innerHTML;
        let key = parentNode.id;

        if (ctrlpage === 'manageproduct')
            key = replaceAll(key, 'p_', '')
        else
            key = replaceAll(key, 'c_', '')
        
        let arrTmp = [];
        
        if (delItem.indexOf('&amp;') !== -1) 
            arrTmp = delItem.split(' &amp; ')
        else    
            arrTmp.push(delItem);    
        if (arrTmp.length > 2 || arrTmp.length <= 0) return;

        e.preventDefault();

        switch (ctrlpage) {
            case 'manageproduct':
                return dispatch(delItemProductForm({
                    key, 
                    vKey: arrTmp[0],
                    vValue: (key === 'colors') ? arrTmp[1] : undefined,
                }));
            
            case 'managecategory':
                return dispatch(delItemCategoryForm({
                    key, 
                    vKey: arrTmp[0],
                    vValue: arrTmp[1],
                }));
            default:
                break;
        }
    };

    // 서버로 데이터 전송
    const onSubmit = (e) => {
        e.preventDefault();

        switch (ctrlpage) {
            case 'manageproduct': {
                const {
                    name,
                    // image,
                    sizes,
                    colors,
                    price,
                    sale,
                    description,
                    detailinfo,
                    categorySub,
                    categoryId,
                } = productForm;

                // errormessage 정의 start..
                let bBreak = false;
                for (const key in productForm) {
                    if (bBreak) break;

                    switch (key) {
                        case 'size':
                        case 'color':
                        case 'colorName':
                        case 'sale':
                        case 'description':
                        case 'categorySub':
                        case 'detailinfo':
                            continue;

                        default: {
                            let value = productForm[key];
                            if (!value) {
                                switch (key) {
                                    case 'name':
                                        setErrorMesssage(
                                            '상품명을 입력해주세요.',
                                        );
                                        break;
                                    case 'image': {
                                        if (!itemId || itemId <= 0) {
                                            setErrorMesssage(
                                                '이미지를 등록해주세요.',
                                            );
                                        } else continue;  
                                        break;                                                                 
                                    }
                                    case 'price':
                                        setErrorMesssage(
                                            '가격을 입력해주세요.',
                                        );
                                        break;

                                    case 'categoryId': {
                                        setErrorMesssage(
                                            '대분류 값을 등록해주세요.',
                                        );
                                        break;
                                    }
                                    default:
                                        break;
                                }
                                bBreak = true;
                                
                            } else if (key === 'sizes' && value.length <= 0) {
                                setErrorMesssage('사이즈 정보를 등록해주세요.');
                                bBreak = true;
                                break;
                            } else if (key === 'colors' && value.length <= 0) {
                                setErrorMesssage('색상 정보를 등록해주세요.');
                                bBreak = true;
                                break;
                            } else {
                                continue
                            }
                        }
                    }
                }
                // errormessage 정의 end..  
                if (bBreak) return;                
                if (itemId > 0) {                    
                    dispatch(
                        adminUpdProduct({
                            name,
                            image: file ? file : null,
                            sizes,
                            colors,
                            price,
                            sale,
                            description,
                            detailinfo,
                            categorySub,
                            categoryId,
                            id: itemId,
                        }),
                    );
                    return;
                }
                
                dispatch(
                    createProduct({
                        name,
                        image: file,
                        sizes,
                        colors,
                        price,
                        sale,
                        description,
                        detailinfo,
                        categorySub,
                        categoryId,
                    }),
                );
                break;
            }

            case 'managecategory': {
                const { key, displayValue, items } = categoryForm;

                if (!key)
                    return setErrorMesssage('카테고리 키를 입력해주세요.');

                dispatch(
                    createCategory({
                        key,
                        displayValue: displayValue || key.toUpperCase(),
                        items,
                    }),
                );
                break;
            }
            default:
                break;
        }
    };

    // 페이지 초기화 (데이터가 전송됬을때도 초기화)
    // 1) product & category 생성
    useEffect(() => {
        switch (ctrlpage) {
            case 'manageproduct': {
                dispatch(initializeProduct());                
                setErrorMesssage('');

                // 대분류, 소분류 select box 생성하기 위해 categoryStatus 기반으로 재정의.
                if (categoryStatus && typeof categoryStatus === 'object') {
                    if (
                        categoryStatus.hasOwnProperty('data') &&
                        categoryStatus.data instanceof Array
                    ) {
                        const arrTmp = [];
                        categoryStatus.data.map((value) => {
                            let items = [];
                            let jsonItems = JSON.parse(value.items);

                            if (jsonItems.length > 0) {
                                jsonItems.map((v) => {
                                    return items.push({
                                        id: v.id,
                                        displayValue: v.value,
                                    });
                                });
                            }

                            return arrTmp.push({
                                id: value.id,
                                displayValue:
                                    value.displayValue ||
                                    String(value.key).toUpperCase(),
                                items,
                            });
                        });                        

                        setCategories(arrTmp.filter((v) => (v.displayValue.toLowerCase() !== 'community')));
                    }
                }
                break;
            }

            case 'managecategory': {
                dispatch(initializeCategory());
                setErrorMesssage('');
                break;
            }

            default:
                break;
        }

        window.scrollTo(0,0);   // 맨위로    
    }, [dispatch, ctrlpage, categoryStatus/* , category, product */]);

    // 2) 상품 수정시 데이터 불러옴
    useEffect(() => {
        if (itemId > 0) 
            dispatch(adminGetProduct({id: itemId}));                    
        else
            return;        
    }, [dispatch, itemId]);

    useEffect(() => {
        if (!itemId) return;
        if (product && product.data) {
            if (product.data.sizes && product.data.colors) {
                const {categoryId, categorySub, sizes,
                    colors, description, detailinfo,
                    name, price, sale, /* image,*/
                } = product.data;
                const loadData = {
                    categoryId,
                    categorySub,
                    description,
                    detailinfo,
                    // image: `C:\\fakepath\\${image}`,
                    name,
                    price,
                    sale: (sale * 100),
                    size: "",
                    color: "#000000",
                    colorName: "",
                };    

                dispatch(
                    initializeProductKey({
                        form: 'productForm',
                        key: 'sizes',
                        updValue: JSON.parse(sizes),
                    })
                );

                dispatch(
                    initializeProductKey({
                        form: 'productForm',
                        key: 'colors',
                        updValue: JSON.parse(colors),
                    })
                );

                for (const key in loadData) {                    
                    dispatch(
                        changeProductForms({
                            form: 'productForm',
                            key,
                            value: loadData[key],
                        }),
                    )
                }                      
            }
        } else return;
    }, [dispatch, product, itemId]);

    // 3) category or product 생성 중 에러 메시지
    useEffect(() => {
        if (ctrlpage === 'manageproduct' && productError) {
            setErrorMesssage(productError.data.message);
        } else if (ctrlpage === 'managecategory' && categoryError) {
            setErrorMesssage(categoryError.data.message);
        }
    }, [ctrlpage, productError, categoryError]);
    // ---

    return (
        <ManageForProductTemplate
            ctrlpage={ctrlpage}
            isUpdate={itemId > 0}
            onChange={onChange}
            onDelete={onDelete} // colors나 sizes에 등록된 개체들 제거하는데 쓰이는 이벤.
            onSubmit={onSubmit}            
            errorMessage={errorMessage}
            // 1) 카테고리
            categoryForm={categoryForm && categoryForm}
            // --
            // 2) 상품
            productForm={productForm && productForm}
            categories={categories && categories}
            subCategories={subCategories && subCategories}
            // --
        />
    );
};

export default withRouter(ManageForProductContainer);

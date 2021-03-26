import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeCategoryForm, initializeCategory } from '../../modules/category';
import {
    changeProductForm,
    createProduct,
    initializeProduct,
    initializeProductItem,
} from '../../modules/product';
import CreateProductRelatedTemplate from '../../components/admin/CreateProductRelatedTemplate';

const CreateProductRelatedContainer = (props) => {
    const { ctrlpage } = props;
    const {
        category, // ~: 전송이 완료된 경우
        categoryForm, // ~Form: 현재 작성하고 있는 값들
        categoryStatus, // 현재 데이터베이스에 있는 카테고리 정보들
        product,
        productForm,
    } = useSelector(({ category, product }) => {
        return {
            category: category.category,
            categoryForm: category.categoryForm,
            categoryStatus: category.categoryStatus,
            product: product.product,
            productForm: product.productForm,
        };
    });
    const [categories, setCategories] = useState([]);

    const dispatch = useDispatch();

    // input onChange
    const onChange = (e) => {
        let { name, value } = e.target;
        if (!name) return; // 버튼에서 계속 name이 사라짐. (input type = 'button'로 하니까 해결됨)

        switch (ctrlpage) {
            case 'createproduct': {
                switch (name) {
                    case 'insertColors': {
                        value = productForm.color;
                        if (!value) return;

                        /*  굳이..? 
                        dispatch(initializeProductItem({key: 'color'}));                         
                        document.getElementsByName('color')[0].value = '';                         
                        */
                        break;
                    }
                    case 'insertSizes': {
                        value = productForm.size;
                        if (!value) return;

                        dispatch(initializeProductItem({ key: 'size' }));
                        // ▼ 바로 위 코드에서 초기화했는데 input 태그의 값이 초기화되지않아 이렇게 처리.. 추후 방법 찾기
                        // 이 초기화안되는 문제가.. CustomInput 태그의 구조때문인듯 내일연구하기.
                        // 201014
                        //document.getElementsByName('size')[0].value = '';
                        break;
                    }
                    default:
                        break;
                }

                return dispatch(
                    changeProductForm({
                        key: name,
                        value,
                    }),
                );
            }
            case 'createcategory': {
                return dispatch(
                    changeCategoryForm({
                        key: name,
                        value,
                    }),
                );
            }
            default:
                break;
        }
    };

    // select box onChange
    const onChangeSelectBox = () => {
        switch (ctrlpage) {
            case "createproduct":                
                break;

            case "createcategory":
                break;
        
            default:
                break;
        }
    };

    // result(span) 배열적인 아이템 Delete
    const onDelete = (e) => {
        const delItem = e.target.innerHTML;
        console.log(delItem);
    };

    // 서버로 데이터 전송
    const onSubmit = (e) => {
        e.preventDefault();

        switch (ctrlpage) {
            case 'createproduct': {
                const {
                    name,
                    image,
                    sizes,
                    colors,
                    price,
                    sale,
                    /*description, categorySub, categoryId, */
                } = productForm;
                dispatch(
                    createProduct({
                        name,
                        image: image || '/images/bymono_test1.webp',
                        sizes,
                        colors,
                        price,
                        sale,
                        description: '',
                        categorySub: 1,
                        categoryId: 1,
                    }),
                );
                break;
            }
            case 'createcategory': {
                //dispatch(());
                break;
            }
            default:
                break;
        }
    };

    // 페이지 초기화 (데이터가 전송됬을때도 초기화)
    // 1) category 생성
    useEffect(() => {
        if (ctrlpage === 'createcategory') {
            dispatch(initializeCategory());
        }
    }, [dispatch, ctrlpage, category]);
    // ---

    // 2) product 생성

    useEffect(() => {
        if (ctrlpage === 'createproduct') {
            dispatch(initializeProduct());

            if (categoryStatus && typeof categoryStatus === 'object') {
                if ( categoryStatus.hasOwnProperty('data') && categoryStatus.data instanceof Array ) {
                    const arrTmp = [];
                    categoryStatus.data.map((value) => {
                        let items = [];
                        let jsonItems = JSON.parse(value.items);

                        if (jsonItems.length > 0) {
                            jsonItems.map((v) => {
                                return items.push({
                                    id: v.id,
                                    displayValue: v.value,
                                })
                            })
                        };

                        return arrTmp.push({
                            id: value.id,
                            displayValue: (value.displayValue || String(value.key).toUpperCase()),
                            items,
                        });
                    });                         
                    setCategories(arrTmp);
                }
            }
        }
    }, [dispatch, ctrlpage, product, categoryStatus]);
    // ---

    return (
        <CreateProductRelatedTemplate
            ctrlpage={ctrlpage}
            onChange={onChange}
            onDelete={onDelete}
            onSubmit={onSubmit}
            onChangeSelectBox={onChangeSelectBox}
            // 1) 카테고리
            categoryForm={categoryForm && categoryForm}
            // --
            // 2) 상품
            productForm={productForm && productForm}
            categories={categories && categories}
            // --
        />
    );
};

export default CreateProductRelatedContainer;

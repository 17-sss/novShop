import React, { useEffect, useRef, useState, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    getAllProduct,
    initializeProductForm,
    adminDelProduct,
} from '../../modules/product';
import ProductTemplate, {
    ProductItem,
    ProductItemUpdate,
    ProductManament,
    ProductEmpty
} from '../../components/product/ProductTemplate';
import { objectFlagIsAllReady } from '../../lib/utility/customFunc';

const ProductContainer = (props) => {
    // [1] 데이터 관련 START ====
    const { query, history } = props;

    const dispatch = useDispatch();
    const { productStatus, userData, loading } = useSelector(
        ({ product, loading, user }) => {
            return {
                productStatus: product.productStatus,
                loading: loading,
                userData: user.user,                
            };
        },
    );
    // ---------------------------------------|

    // [2] useHooks & event & function START ====
    // 1) 일반
    const [colHeight, setColHeight] = useState(0);
    const [imgHeight, setImgHeight] = useState(0);
    const [isDelete, setIsDelete] = useState(false);
    const [queryTmp, setQueryTmp] = useState({});
    const [visibleOption, setVisibleOption] = useState(false);
    const [allLoadingOK, setAllLoadingOK] = useState(false);

    const colRef = useRef(null);
    const imgRef = useRef(null);

    const userAuthority = userData && userData.data && userData.data.authority;

    // +) loading 체크
    useEffect(() =>  {      
        setAllLoadingOK(false);
        const bIsOK = objectFlagIsAllReady(loading);        
        setAllLoadingOK(bIsOK);  
    }, [loading]);

    // 무한루프 방지용 (query 값 계속가져와서 state로 관리)
    useEffect(() => {   
        if (!query || typeof query !== "object") return;
        
        for (const key in query) {            
            const queryElement = query[key];
            const queryTmpElement = queryTmp[key];
            
            if (queryElement !== queryTmpElement) {
                setQueryTmp(query);
                break;
            }
        }
    }, [query, queryTmp])

    // 상품 데이터 불러옴
    useEffect(() => {                      
        dispatch(initializeProductForm({ form: 'productStatus' }));
        dispatch(
            getAllProduct({
                categoryId: queryTmp ? queryTmp.main : undefined,
                categorySub: queryTmp ? queryTmp.sub : undefined,
            }),
        );
        if (isDelete) setIsDelete(false);
    }, [dispatch, queryTmp, isDelete]);

    useEffect(() => {
        // 이미지 못 불러왔을 경우 여기서 에러먹기에 조건 줌.
        colRef.current && setColHeight(colRef.current.clientHeight);
    }, [colHeight, imgHeight]);

    const imageOnLoad = () => {
        return setImgHeight(imgRef.current.clientHeight);
    };

    const imageTagHeight = () => {
        if (colHeight === 0 || imgHeight === 0) {
            return;
        }

        if (colHeight * 0.7 < imgHeight) return 'auto';
        else return colHeight * 0.7;
    };

    // 2) Admin용 Events
    // 상품 수정 폼으로 이동
    const onProductUpdate = useCallback((e) => {
        e.preventDefault();
        const { value } = e.target;        
        // 수정 폼으로 가기전에 해당 폼 초기화 (리덕스 저장소에서 productForm 초기화)
        dispatch(initializeProductForm({form: "productForm"}) );    

        // 수정 폼 이동. (수정 폼에서 itemId 기반으로 데이터 가져옴)
        history.push(`/admin/manageproduct?itemId=${value}`);
    }, [history, dispatch]);

    // 상품 삭제
    const onProductDelete = (e) => {
        e.preventDefault();
        const { value: id } = e.target;
        if (!id) return;

        if (window.confirm('해당 상품을 삭제하시겠습니까?')) {
            dispatch(adminDelProduct({ id }));
            setIsDelete(true); // 다시 상품 리스트 불러오기위해 isDelete 상태 변경
        } else return;
    };

    // 상품 관리 (수정 / 삭제) 버튼 Visible 제어
    const onProductManageBtnVisible = () => {
        setVisibleOption(!visibleOption);
    };

    // ---------------------------------------|

    // [3] ProductItem에 들어가는 props 미리 정의
    const refs = { colRef, imgRef };
    const events = { imageOnLoad };
    const funcs = { imageTagHeight };
    // ---------------------------------------|

    // [4] ProductItem 생성 [ [], [] 형식으로 생성 ]
    const createItems = (arrData = []) => {
        if (!arrData || arrData.length <= 0) return null;

        const productItems = [];
        arrData.map((v, i) => {
            const {
                id,
                name,
                image,
                sizes,
                colors,
                price,
                sale,
                description,
                categorySub,
                categoryId,
            } = v;

            let aLink = '/shopping';
            if (id) {
                if (!categoryId && !categorySub) {
                    aLink = aLink + `?itemId=${id}`;
                } else if (categoryId && !categorySub) {
                    aLink = aLink + `?main=${categoryId}&itemId=${id}`;
                } else if (categoryId && categorySub) {
                    aLink =
                        aLink +
                        `?main=${categoryId}&sub=${categorySub}&itemId=${id}`;
                }
            } else {
                return <div>Error: id가 없을 수가?</div>;
            }

            let encSizes,
                encColors = [];
            sizes && (encSizes = JSON.parse(sizes));
            colors && (encColors = JSON.parse(colors));

            const jsx = (
                <div key={id}>
                    <ProductItemUpdate
                        isAdmin={userAuthority > 0 && visibleOption}
                        id={id}
                        events={{
                            onUpdate: onProductUpdate,
                            onDelete: onProductDelete,
                        }}
                    />
                    <ProductItem
                        itemName={name}
                        itemImage={
                            '/uploads/' + image || '/images/bymono_test1.webp'
                        }
                        itemLink={aLink}
                        itemSize={encSizes}
                        itemColors={encColors}
                        price={price}
                        sale={sale}
                        description={description}
                        refs={refs}
                        events={events}
                        funcs={funcs}
                    />
                </div>
            );

            return productItems.push(jsx);
        });

        const childArrayCnt =
            productItems.length > 0 && productItems.length < 4
                ? 1
                : productItems.length <= 0
                ? 0
                : Math.round(productItems.length / 4);

        const result = [];

        [...Array(childArrayCnt)].map((v, i) => {
            let start = i * 4;
            let end = start + 4;
            // 0, 4
            // 4, 8
            // 8, 12
            return result.push(productItems.slice(start, end));
        });

        return result;
    };
    // ---------------------------------------|

    return allLoadingOK &&
        productStatus &&
        productStatus.data &&
        productStatus.data.length > 0 ? (
        <>            
            <ProductManament
                events={{ onVisible: onProductManageBtnVisible }}
                isAdmin={userAuthority > 0}
            />
            {createItems(productStatus.data).map((v, i) => (
                <ProductTemplate key={i}>{v}</ProductTemplate>
            ))}                    
        </>
    ) : <ProductEmpty/>;
};

export default withRouter(ProductContainer);

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProduct, initializeProductForm } from '../../modules/product';
import ProductTemplate, {
    ProductItem,
} from '../../components/product/ProductTemplate';

const ProductContainer = (props) => {
    // [1] 데이터 관련 START ====
    const { query } = props;
    const dispatch = useDispatch();
    const { productStatus, productLoading } = useSelector(
        ({ product, loading }) => {
            return {
                productStatus: product.productStatus,
                productLoading: loading['GET_ALL_PRODUCT'],
            };
        },
    );

    useEffect(() => {
        dispatch(initializeProductForm({form: "productStatus"}));
        dispatch(
            getAllProduct({
                categoryId: query ? query.main : undefined,
                categorySub: query ? query.sub : undefined,
            }),
        );
    }, [dispatch, query]);
    // ---------------------------------------|

    // [2] useHooks & event & function START ====
    const [colHeight, setColHeight] = useState(0);
    const [imgHeight, setImgHeight] = useState(0);

    const colRef = useRef(null);
    const imgRef = useRef(null);

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
    // ---------------------------------------|

    // [3] ProductItem에 들어가는 props 미리 정의
    const refs = { colRef, imgRef };
    const events = { imageOnLoad };
    const funcs = { imageTagHeight };
    // ---------------------------------------|

    // [4] ProductItem 생성 [ [], [] 형식으로 생성 ]
    const createItems = (arrData = []) => {
        if (!arrData || (arrData.length <= 0)) return null;        

        const productItems = [];
        arrData.map((v, i) => {
            const {
                id, name, image, sizes, colors, price,
                sale, description, categorySub, categoryId,
            } = v;
    
            let aLink = '/shopping';
            if (id) {
                if (!categoryId && !categorySub) {
                    aLink = aLink + `?itemId=${id}`;
                } else if (categoryId && !categorySub) {
                    aLink =
                        aLink + `?main=${categoryId}&itemId=${id}`;
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
                <ProductItem
                    key={id}
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
            );
    
            return productItems.push(jsx);       
        })   

        const childArrayCnt = 
            (productItems.length > 0 && productItems.length < 4) 
                ? 1
                : productItems.length <= 0 
                ? 0 
                : Math.round(productItems.length / 4);
                
        const result = [];
        
        [...Array(childArrayCnt)].map((v, i) => {
            let start = (i * 4);
            let end = start + 4;            
            // 0, 4
            // 4, 8
            // 8, 12                        
            return result.push(productItems.slice(start, end));
        });
        
        return result;
    }    
    // ---------------------------------------|
    

    return !productLoading && productStatus && productStatus.data && productStatus.data.length > 0 
        ? createItems(productStatus.data).map((v) => <ProductTemplate>{v}</ProductTemplate>) : (<></>)            
};

export default ProductContainer;

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProduct } from '../../../../modules/product';
import ProductTemplate, { ProductItem } from "../../../../components/product/ProductTemplate";

const ProductContainer = () => {    // 전체목록이 아닌 상세분류 목록을 위한 것도 만들어야할듯.
    // [1] 데이터 관련 START ====
    const dispatch = useDispatch();
    const {productStatus} = useSelector( ({product}) => {
        return {
            productStatus: product.productStatus,          
        };
    });

    useEffect( () => {
        dispatch(getAllProduct());
    }, [dispatch]);
    // [1] 데이터 관련 END ====

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
    // [2] useHooks & event & function END ====

    const refs = {colRef, imgRef};
    const events = {imageOnLoad};
    const funcs = {imageTagHeight};
    /*
    const {colRef, imgRef} = refs;
    const {imageOnLoad} = events;
    const {imageTagHeight} = funcs;
    */

    return (    
        <ProductTemplate>
            {(productStatus && productStatus.data.length > 0) &&                
                productStatus.data.map( (v) => {
                    const {id, name, image, sizes, colors, price, sale, description, categorySub, categoryId} = v;
                    const aLink = "/shopping/" + categoryId +"/"+ categorySub +"?itemId=" + id;
                    
                    let encSizes, encColors = [];
                    encSizes = JSON.parse(sizes);
                    encColors = JSON.parse(colors);

                    return (
                        <ProductItem 
                            key = {id}
                            itemName = {name} 
                            itemImage = {'/uploads/' + image || '/images/bymono_test1.webp'}                                             
                            itemLink = {aLink}
                            itemSize = {encSizes}
                            itemColors = {encColors}
                            price = {price}
                            sale = {sale}
                            description = {description}

                            refs = {refs}
                            events = {events}
                            funcs = {funcs}                            
                        />                        
                    )
                })
            }
        </ProductTemplate>
        /*
        // /shopping/shirt/0?itemId=0
        
        <ProductForm>            
            {productData.map( (v, i) => {
                const {itemId, itemName, itemImage, itemSize, itemColors, price, sale, description, classification} = v;
                const {mainclass, subclass} = classification;
                const aLink = "/shopping/" + mainclass +"/"+ subclass+"?itemId="+itemId;

                return (
                    <ProductItem
                        key = {itemId}
                        itemName = {itemName} 
                        itemImage = {itemImage}                                             
                        itemLink = {aLink}
                        itemSize = {itemSize}
                        itemColors = {itemColors}
                        price = {price}
                        sale = {sale}
                        description = {description}
                    />
                );
            })}                        
        </ProductForm>        
        */
    );
};


export default ProductContainer;
import React, { useEffect, useState, useRef } from 'react';
import { Col } from 'react-bootstrap';
import styled from 'styled-components';
import { getSize } from '../../../../lib/utility/customFunc';

const StyledItem = styled(Col)`
    height: ${getSize(1.6, 'height')};
    border: 1px solid black;
    padding: 15px;
`;

const Image = styled.div`
    text-align: center;
`;

const ProductItem = (props) => {
    const { children } = props;

    const [colSize, setColSize] = useState({ width: 0, height: 0 });
    const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
    const [height, setHeight] = useState('');
    const colRef = useRef();

    const settingHeight = (AcolHeight, AimgHeight) => {
        if ((AcolHeight * 0.5) < AimgHeight) {
            return 'auto';
        } else {
            return (AcolHeight * 0.5);
        }
    };

    useEffect(() => {
        setColSize({
            width: colRef.current.clientHeight,
            height: colRef.current.clientWidth,
        });
        setHeight(settingHeight(colSize.height, imgSize.height));
    }, [colSize.height, imgSize.height]);

    return (
        <StyledItem ref={colRef}>
            <Image>
                <img
                    onLoad={({ target: img }) => {
                        return setImgSize({
                            width: img.width,
                            height: img.height,
                        });
                    }}
                    // src="/images/200810.jpg"
                    src= "/images/bymono_test1.webp"
                    alt="test"
                    width="100%"
                    height={height}
                />
            </Image>
            <div>{children}</div>
        </StyledItem>
    );
};

export default ProductItem;

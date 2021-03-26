import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import {getSize} from '../../../lib/utility/customFunc';

const StyledSwipeItem = styled.div`
    ${(props) =>
        props.imageLink === undefined
        ? css`
            background-image: url('/logo512.png');
        `
        : css`
            background-image: url(${props.imageLink});
        `
    };

    ${(props) =>
        props.imageSize === undefined
         /* 옵션 메모: contain | cover | 100% 100% */
        ? css`
            /* contain하면 화면 크기 바뀔때 같이 커졌다 작아졌다하심.. */
            background-size: cover; 
        `
        : css`
            background-size: ${props.imageSize};
        `
    };

    background-repeat: no-repeat;
    /* 옵션 메모: center center | center top */
    background-position: center top;
    display: block;

    margin: 0 auto;
    position: relative;
    color: ${(props) => props.color || '#FFF'};
    width: ${(props) => props.width || getSize(1) };
    height: ${(props) => props.height || "680px"};    
    min-height: ${(props) => props.minHeight || "100%"};
    
    cursor: pointer;
`;

const SwipeItem = (props) => {
    const [isDrag, setIsDrag] = useState(false);

    return (
        <StyledSwipeItem                        
            onMouseDown={() => setIsDrag(false)}
            onMouseMove={() => setIsDrag(true)}
            onMouseUp={() => isDrag || (global.location.href = props.to)}
            imageLink={props.imageLink}
            imageSize={props.imageSize}                                
            to={props.to}                 
        />           
    );
};

export default SwipeItem;


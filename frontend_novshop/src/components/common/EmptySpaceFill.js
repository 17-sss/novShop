// 빈 공간 채우기 전용.  (보류)
import React from 'react';
import { getSize } from '../../lib/utility/customFunc';

const EmptySpaceFill = () => {    
    // console.log(document.getElementById('root').offsetHeight, document.getElementById('root').clientHeight, document.getElementById('root').scrollHeight)

    return (
        <div
            style={{
                height: `${
                    Number(getSize(1, 'height', false, true)) -
                    document.getElementById('root').offsetHeight
                }px`,           
            }}
        />
    );
};

export default EmptySpaceFill;

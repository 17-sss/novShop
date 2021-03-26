import React from 'react';
import { Container, Row } from 'react-bootstrap';
import styled from 'styled-components';
import { getSize } from '../../../lib/utility/customFunc';

const ProductContainer = styled(Container)`
    width: ${getSize(1.2)};
    max-width: none !important;
    padding: 1% 0;
    margin: 0 auto;
`;

const ProductItemRow = styled(Row)`
    margin: 0 5%;
`;


const ProductForm = (props) => {
    const {children} = props;

    return (
        <ProductContainer>
            <ProductItemRow className="row-cols-4">
                {children}
            </ProductItemRow>
        </ProductContainer>
    );
};

export default ProductForm;
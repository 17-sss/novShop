import React from "react";
import styled from "styled-components";
import { getSize } from "../../lib/utility/customFunc";

const TestWrapper = styled.div`
    width: ${getSize(1.45)};
    margin: 0 auto;
`;

const FormDataTestTemplate = (props) => {
    const {onChange, onSubmit} = props;
    return (
        <TestWrapper>
            <form encType="multipart/form-data" onSubmit = {onSubmit}>
                <input type="file" name="image" onChange = {onChange} />
                <br/>

                <button type="submit">
                    전송
                </button>
            </form>
        </TestWrapper>
    )
};

export default FormDataTestTemplate; 
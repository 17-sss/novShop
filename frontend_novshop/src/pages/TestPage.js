import React from 'react';
import { withRouter } from 'react-router-dom';
import FormDataTestContainer from '../containers/test/FormDataTestContainer';
import EditorTestContainer from '../containers/test/EditorTestContainer';

const TestPage = ({ match }) => {
    const {
        params: { opt },
    } = match;    

    return opt === 'formdata' ? (
        <FormDataTestContainer />
    ) : opt === 'editor' ? (
        <EditorTestContainer/>
    ) : (
        <div>없음</div>
    );
};

export default withRouter(TestPage);

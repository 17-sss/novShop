import React from 'react';
import { withRouter } from 'react-router-dom';
import Footer from '../../components/base/Footer';

const FooterContainer = (props) => {
    /*
    const { location } = props;
    const { pathname } = location;

    return pathname !== '/error' ? <Footer /> : <></>;
    */
   return <Footer/>;
};

export default withRouter(FooterContainer);

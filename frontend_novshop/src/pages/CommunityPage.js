import React from 'react';
import queryString from 'query-string';
import CommunityContainer from '../containers/community/CommunityContainer';
import CommunityViewContainer from '../containers/community/CommunityViewContainer';

const CommunityPage = (props) => {    
    const {location} = props;
    const query = queryString.parse(location.search);
    const {num} = query;

    return (
        num ? <CommunityViewContainer num={num} /> : <CommunityContainer />        
    );
};

export default CommunityPage;
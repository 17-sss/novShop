import React from 'react';

import MemberContainer from '../containers/member/MemberContainer';
import ProfileContainer from "../containers/auth/RegisterContainer";    // ProfileContainer는 RegisterContainer 겸 쓰임.
import OrderListContainer from '../containers/purchase/OrderListContainer';
import ErrorContainer from '../containers/error/ErrorContainer';


const MemberPage = (props) => {
    const {
        match: { params },
    } = props;
    const { userid, opt } = params;

    return userid ? (
        opt ? (
            opt === 'profile' ? (
                <ProfileContainer isUpdateForm />
            ) : opt === 'order' ? (
                <OrderListContainer />
            ) : (
                opt !== 'profile' && opt !== 'order' && <ErrorContainer />
            )
        ) : (
            <MemberContainer />
        )
    ) : (
        <ErrorContainer />
    );
};

export default MemberPage;

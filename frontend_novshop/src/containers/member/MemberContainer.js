import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getBuyListPrice, initialPurchaseForm } from '../../modules/purchase';
import MemberTemplate from '../../components/member/MemberTemplate';
import ErrorContainer from '../error/ErrorContainer';

const MemberContainer = (props) => {
    const {
        match: { params },
    } = props;

    const dispatch = useDispatch();
    const { userData, buyData } = useSelector(({ user, purchase }) => ({
        userData: user.user,
        buyData: purchase.buy,
    }));

    useEffect(() => {
        dispatch(initialPurchaseForm({ form: 'buy' }));
    }, [dispatch]);

    useEffect(() => {
        if (!userData || !userData.data) return;
        dispatch(getBuyListPrice({ userId: userData.data.id }));
    }, [dispatch, userData]);

    return userData &&
        userData.data &&
        params.userid === userData.data.userid ? (
        <MemberTemplate
            userData={userData && userData.data}
            buyData={buyData && buyData.data}
        />
    ) : (
        <ErrorContainer />
    );
};

export default withRouter(MemberContainer);

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { initializeNotice, getNotice } from '../../modules/notice';
import { initializeQA, getQA } from '../../modules/qa';

import CommunityViewTemplate from '../../components/community/CommunityViewTemplate';

const CommunityViewContainer = (props) => {
    const { num, match, location } = props;
    const { pathname, /* search */ } = location;
    const { page } = match.params;
    const pageName = page === 'qa' ? '고객센터' : '공지사항';

    const dispatch = useDispatch();
    const { noticeStatus, qaStatus } = useSelector(
        ({ notice, qa }) => {
            return {
                noticeStatus: notice.noticeStatus,
                qaStatus: qa.qaStatus,
            };
        },
    );

    useEffect(() => {
        if (page === 'qa') {
            dispatch(initializeQA());
            dispatch(getQA({ id: num }));
        } else {
            dispatch(initializeNotice());
            dispatch(getNotice({ id: num }));
        }
    }, [dispatch, num, page]);

    let data =
        page === 'qa'
            ? qaStatus && qaStatus.data
            : noticeStatus && noticeStatus.data
    
    const etcDatas = {
        num,
        page,
        pageName,
        // listurl: pathname + search,
        pathname,
    };    

    return <CommunityViewTemplate etcDatas={etcDatas} data={data && data} />;
};

export default withRouter(CommunityViewContainer);

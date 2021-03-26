import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { initializeQA, getProductQA } from '../../modules/qa';
import {
    initializeNotice,
    getAllNotice,
} from '../../modules/notice';

import CommunityTemplate from '../../components/community/CommunityTemplate';

const CommunityContainer = (props) => {
    let { onePageViewCnt, match } = props;
    const { page } = match && match.params;

    const dispatch = useDispatch();
    const { qaStatus, noticeStatus, qaLoading, noticeLoading, userData } = useSelector(({ qa, notice, loading, user }) => {
        return {
            qaStatus: qa.qaStatus,
            noticeStatus: notice.noticeStatus,
            qaLoading: loading['qa/GET_PRODUCT_QA'],
            noticeLoading: loading['notice/GET_NOTICE'],
            userData: user.user
        };
    });

    const [onePageCnt, setOnePageCnt] = useState(onePageViewCnt);
    const [pageCount, setPageCount] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const [currentDatas, setCurrentDatas] = useState([]);

    // useEffect    ---------------------------------------------------------------------------------
    // 초기화 & 데이터 불러옴
    useEffect(() => {
        dispatch(initializeQA());
        dispatch(initializeNotice());
        
        setCurrentDatas([]);
        setPageCount(0);

        if (page === 'qa') {            
            dispatch(getProductQA({ productId: 0 /* 0일 경우 전부 불러옴 */ }));
        } else {            
            dispatch(getAllNotice());
        }
    }, [dispatch, page]);

    // 페이징 버튼 & 데이터 세팅
    useEffect(() => {
        if (
            (noticeStatus && noticeStatus.data) ||
            (qaStatus && qaStatus.data)
        ) {
            onePageCnt || setOnePageCnt(10);
            let dataTmp =
                noticeStatus && noticeStatus.data
                    ? noticeStatus.data
                    : qaStatus && qaStatus.data
                    ? qaStatus.data
                    : null;
            if (!dataTmp) return;
            if (!dataTmp instanceof Array) return;

            setPageCount(Math.ceil(dataTmp.length / onePageCnt));

            const indexOfLast = currentPage * onePageCnt;
            const indexOfFirst = indexOfLast - onePageCnt;

            const createTmpData = () => {
                if (typeof dataTmp.slice !== 'function') return;
                let tmpData =
                    dataTmp && dataTmp.slice(indexOfFirst, indexOfLast);
                tmpData && tmpData.length > 0 && setCurrentDatas(tmpData);
                // console.log(dataTmp, tmpData, currentDatas)
            };
            createTmpData();            
        }
    }, [onePageCnt, noticeStatus, qaStatus, pageCount, currentPage]);

    // onClick  ---------------------------------------------------------------------------------
    // 페이징
    const pagingBtnClick = (e) => {
        e.preventDefault();
        const { value } = e.target;
        if (!value || value <= 0) return;
        setCurrentPage(value);
    };    
    // ==========

    const etcData = {
        subjectData:
            page === 'qa'
                ? [
                      { name: '번호', width: '12.5%' },
                      { name: '제목', width: '50%' },
                      { name: '작성자', width: '12.5%' },
                      { name: '날짜', width: '15%' },
                      { name: '조회', width: '10%' },
                  ]
                : [
                      // notice && ''
                      { name: '번호', width: '15%' },
                      { name: '제목', width: '70%' },
                      { name: '작성자', width: '15%' },
                  ],
        pageName: page === 'qa' ? '고객센터' : '공지사항',
        page: page ? page : '',
        currentPage,
        pageCount,
        userData: userData ? userData.data : null,
    };

    const events = {
        pagingBtnClick,
    };    

    return (
        (page === 'qa' ? !qaLoading : !noticeLoading)
        &&
        <CommunityTemplate
            etcData={etcData}
            data={currentDatas && currentDatas}
            events={events}
        />
    );
};

export default withRouter(CommunityContainer);

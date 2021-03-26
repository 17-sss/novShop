import React from 'react';
import { withRouter } from 'react-router-dom';
import CommunityTemplate from '../../components/community/CommunityTemplate';

const CommunityContainer = ({ match }) => {
    const { page } = match && match.params;
    const etcData = {
        subjectData:
            page === 'cs'
                ? [
                      { name: '번호', width: '12.5%' },
                      { name: '제목', width: '50%' },
                      { name: '작성자', width: '12.5%' },
                      { name: '날짜', width: '12.5%' },
                      { name: '조회', width: '12.5%' },
                  ]
                : [
                      // notice && ''
                      { name: '번호', width: '15%' },
                      { name: '제목', width: '70%' },
                      { name: '작성자', width: '15%' },
                  ],

        // page === 'notice'
        //     ? [
        //           { name: '번호', width: '15%' },
        //           { name: '제목', width: '70%' },
        //           { name: '작성자', width: '15%' },
        //       ]
        //     : page === 'cs'
        //     ? [
        //           { name: '번호', width: '12.5%' },
        //           { name: '제목', width: '50%' },
        //           { name: '작성자', width: '12.5%' },
        //           { name: '날짜', width: '12.5%' },
        //           { name: '조회', width: '12.5%' },
        //       ]
        //     : '',
        pageName:
            page === 'cs' ? '고객센터' : '공지사항',
        // page === 'notice' ? '공지사항' : page === 'cs' ? '고객센터' : '',
    };

    return <CommunityTemplate etcData={etcData} data={null} />;
};

export default withRouter(CommunityContainer);

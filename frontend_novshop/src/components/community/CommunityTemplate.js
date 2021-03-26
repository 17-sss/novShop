import React from 'react';
import styled from 'styled-components';
import { CustomLink } from '../../components/common/StyleUtilModels';
import { cssTransparent } from '../../components/common/StyleUtilCSS';
import {
    CommonTableWrapper as CommunityWrapper,
    CommonTableMultiWrapper as CommunityMultiWrapper,
    StyledTable,
    StyledTh,
    StyledTd,
    SubjectLink,
    EmptyWrapper,
} from '../common/CommonTableComponents';


// [1 : import (as)] Wrapper
/*
    1) CommunityWrapper: 전체 Wrapper 
    2) CommunityMultiWrapper: Multi Wrapper
*/
// ---------------------------------------------------/

// [2 : import] Table 관련
/*
    1) StyledTable: table
    2) StyledTh: th
    3) StyledTd: td
    4) SubjectLink: Link Custom
    5) EmptyWrapper    
*/
// ---------------------------------------------------/

// [4] 페이징
// 1) PagingWrapper: 페이징관련 개체들 Wrapper
const PagingWrapper = styled.div`
    display: inline-block;
    position: relative;
    width: 100%;
    margin: 10px auto;

    text-align: center;
    justify-content: center;
    align-items: center;
`;
// ---------------------------------------------------/

// 2) PagingBtn: 페이지 번호용 btn
const PagingBtn = styled.input`
    ${cssTransparent};
    font-size: 8pt;
    width: 20px;
    height: 20px;
    margin-left: 4px;
    box-shadow: 0 0 0 0.2px;
    background-color: ${(props) => (props.selectbtn ? '#c0c0c0' : 'ffffff')};
`;
// ---------------------------------------------------/

// [5] 작성 폼
// 1) WriteWrapper
const WriteWrapper = styled.div`
    display: inline-block;
    position: absolute;
    right: 0px;
    width: auto;
`;
// ---------------------------------------------------/

// 2) WriteLink, 분류에 따른 작성 폼으로 이동
const WriteLink = styled(CustomLink)`
    ${cssTransparent}
    padding: 2.5px;
    width: auto;
    height: 25px;
    box-shadow: 0 0 0 0.2px;
    border-radius: 1.4px;

    &:hover {
        background-color: #c0c0c0;
        color: white;
    }
`;
// ---------------------------------------------------/

const CommunityTemplate = (props) => {
    const { data, etcData, events } = props;
    const { pagingBtnClick } = events;
    const {
        subjectData,
        pageName,
        page,
        pageCount,
        currentPage,
        userData,
    } = etcData;

    const WriteLinkJSX = (
        <WriteWrapper>
            <WriteLink to={'/write/' + page}>글 작성</WriteLink>
        </WriteWrapper>
    );

    return (
        <CommunityWrapper>
            <CommunityMultiWrapper style={{margin: "50px 0 20px"}} stype="pagename">
                <p id="pageType">{pageName}</p>
            </CommunityMultiWrapper>

            <CommunityMultiWrapper stype="table">
                {data && data.length > 0 ? (
                    <StyledTable>
                        <colgroup>
                            {subjectData &&
                                subjectData.map((v, i) => (
                                    <col key={i} style={{ width: v.width }} />
                                ))}
                        </colgroup>
                        <thead>
                            <tr>
                                {subjectData &&
                                    subjectData.map((v, i) => (
                                        <StyledTh key={i}>{v.name}</StyledTh>
                                    ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data &&
                                data.map((v, i) => {
                                    return (
                                        <tr key={i}>
                                            <StyledTd>{v.RN || v.id}</StyledTd>
                                            <StyledTd align="left">
                                                <SubjectLink
                                                    to={'?num=' + v.id}
                                                >
                                                    {v.subject}
                                                </SubjectLink>
                                            </StyledTd>
                                            <StyledTd align="center">
                                                {v.userDisplayId}
                                            </StyledTd>
                                            {pageName === '고객센터' && (
                                                <>
                                                    <StyledTd align="center">
                                                        {new Date(v.createdAt)
                                                            .toLocaleString()
                                                            .toLowerCase() !==
                                                            'invalid date' &&
                                                            new Date(
                                                                v.createdAt,
                                                            ).toLocaleString()}
                                                    </StyledTd>
                                                    <StyledTd align="center">
                                                        {v.view}
                                                    </StyledTd>
                                                </>
                                            )}
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </StyledTable>
                ) : (
                    <EmptyWrapper>
                        <span>게시글이 없습니다.</span>
                    </EmptyWrapper>
                )}

                <PagingWrapper>
                    {pageCount > 0 &&
                        [...Array(pageCount)].map((v, i) => {
                            // map대신 for문 쓰고 싶을 때
                            let index = i + 1;
                            let selectbtn = index === Number(currentPage);
                            return (
                                <PagingBtn
                                    key={i}
                                    type="button"
                                    onClick={pagingBtnClick}
                                    selectbtn={selectbtn}
                                    value={index}
                                />
                            );
                        })}

                    {userData &&
                        (userData.authority !== 0 ? (
                            WriteLinkJSX
                        ) : userData.authority === 0 && page === 'qa' ? (
                            WriteLinkJSX
                        ) : (
                            <></>
                        ))}
                </PagingWrapper>
            </CommunityMultiWrapper>
        </CommunityWrapper>
    );
};

export default CommunityTemplate;

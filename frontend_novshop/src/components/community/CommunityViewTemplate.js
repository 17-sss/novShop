import React from 'react';
import styled, { css } from 'styled-components';
import { getSize } from '../../lib/utility/customFunc';
import { cssTransparent } from '../../components/common/StyleUtilCSS';
import { StyledHr, CustomLink } from '../../components/common/StyleUtilModels';
import ContentView from '../common/ContentView';


// [1] CommunityViewWrapper: 전체 Wrapper
const CommunityViewWrapper = styled.div`
    width: ${getSize(1.45)};
    margin: 0 auto;
`;
// ---------------------------------------------------/

// [2] CommunityMultiWrapper
const CommunityMultiWrapper = styled.div`
    width: 100%;

    ${(props) => {
        const { stype } = props;
        switch (stype) {
            case 'pagename': // 타입 (공지, CS)등을 이름을 표시하기 위한 틀 생성
                return css`
                    min-height: 30px;
                    margin: 50px 0 20px;
                    border-bottom: 0;
                    text-align: center;

                    p#pageType {
                        font-weight: 100;
                        color: #222;
                        font-size: 20px;
                    }
                `;
            case 'table': // 테이블
                return css`
                    margin: 30px auto;
                `;
            case 'content': // 내용 (in HTML)
                return css`
                    margin: 10px auto;
                    padding: 5px;
                `;
            default:
                break;
        }
    }}
`;
// ---------------------------------------------------/

// [3] Styled된 테이블 관련 요소
// 1) Table
const StyledTable = styled.table`
    width: 100%;
`;

// 2) Td
const StyeldTd = styled.td`
    height: 40px;
    padding: 0 10px;

    ${(props) => {
        let { width } = props;
        return css`
            width: ${width};
            background-color: ${width === '10%' ? '#e0e0e0' : '#ffffff'};
        `;
    }}

    ${(props) => {
        let { align } = props;
        align = align || 'center';

        return css`
            text-align: ${align};
            align-items: ${align};
            justify-content: ${align};
        `;
    }};

    ${(props) => {
        let { border } = props;
        let cssTmp = '';
        switch (border) {
            case 'bot_right':
                cssTmp = css`
                    border-right: 0.3px solid #9e9e9e;
                    border-bottom: 0.3px solid #9e9e9e;
                `;
                break;
            case 'bot':
                cssTmp = css`
                    border-bottom: 0.3px solid #9e9e9e;
                `;
                break;
            default:
                break;
        }

        return cssTmp;
    }}
`;
// ---------------------------------------------------/

// [4] input 태그 & a 태그
// 1) input
const CommunityInput = styled.input`
    ${cssTransparent};
    ${(props) => {
        const { type } = props;
        switch (type) {
            case 'button':
            case 'submit':
                return css`
                    padding: 2px 8px;
                    border: 1px solid #d1d1d1;
                    border-radius: 2px;
                    font-size: 12px;
                    font-weight: normal;
                    color: #222;
                    background-color: #fff;
                `;
            default:
                break;
        }
    }}
`;

// 2) Link (a)
const CommunityLink = styled(CustomLink)`
    ${cssTransparent};
    ${(props) =>
        props.type === 'button'
            ? css`
                  padding: 2px 8px;
                  border: 1px solid #d1d1d1;
                  border-radius: 2px;
                  font-size: 12px;
                  font-weight: normal;
                  color: #222;
                  background-color: #fff;
              `
            : css``};
`;
// ---------------------------------------------------/

// [5] CommunityHr
const CommunityHr = styled(StyledHr)`
    width: 100%;
    margin: 10px auto;
`;
// ---------------------------------------------------/

const CommunityViewTemplate = (props) => {
    const { etcDatas, data } = props;
    const { pageName, pathname } = etcDatas;

    return (
        <CommunityViewWrapper>
            <CommunityMultiWrapper stype="pagename">
                <p id="pageType">{pageName}</p>
            </CommunityMultiWrapper>
            <CommunityMultiWrapper stype="table">
                <form onSubmit={() => alert('1')}>
                    {data && (
                        <>
                            <StyledTable>
                                <tbody>
                                    <tr>
                                        <StyeldTd
                                            width="10%"
                                            border="bot_right"
                                        >
                                            제목
                                        </StyeldTd>
                                        <StyeldTd
                                            width="90%"
                                            border="bot"
                                            align="left"
                                        >
                                            {data.subject}
                                        </StyeldTd>
                                    </tr>
                                    <tr>
                                        <StyeldTd
                                            width="10%"
                                            border="bot_right"
                                        >
                                            작성자
                                        </StyeldTd>
                                        <StyeldTd
                                            width="90%"
                                            border="bot"
                                            align="left"
                                        >                                            
                                            {data.user && data.user.userid}
                                        </StyeldTd>
                                    </tr>
                                </tbody>
                            </StyledTable>
                            <CommunityMultiWrapper stype="content">
                                <ContentView content={data.content} />                      
                            </CommunityMultiWrapper>
                        </>
                    )}

                    <CommunityHr />
                    <CommunityLink
                        type="button"
                        // to = {"/community/" + page}
                        to={pathname}
                    >
                        목록
                    </CommunityLink>
                    <br />
                    <br />
                    <br />
                    <CommunityInput type="submit" />
                </form>
            </CommunityMultiWrapper>
        </CommunityViewWrapper>
    );
};

export default CommunityViewTemplate;

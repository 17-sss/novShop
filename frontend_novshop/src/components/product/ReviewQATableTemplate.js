import React from 'react';
import styled, { css } from 'styled-components';
import { getSize } from '../../lib/utility/customFunc';
import { CustomLink } from '../common/StyleUtilModels';
import { cssDisplayNone, cssTransparent } from '../common/StyleUtilCSS';
import ContentView from '../common/ContentView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';       // fas
import { Accordion } from 'react-bootstrap';

// [1] TableWrapper
const TableWrapper = styled.div`
    width: ${(props) => props.width || getSize(1.4)};
    margin: 0 auto;    
`;
// ---------------------------------------------------/

// [2] 테이블 관련 요소 (DIV)    
// 1) TableFrame 
const TableFrame = styled.div`    
    margin: 0 5%;
    width: 90%;    
    ${props => props.visible || cssDisplayNone};    
`;
// ---------------------------------------------------/

// 2) LineDiv
const LineDiv = styled.div`
    width: 100%;    
    ${props => props.empty && css`text-align: center; padding: 0.5rem 1rem;`};
    ${props => {
        const {stype} = props;
        switch (stype) {
            case "TBline":                
                return css`border-top: 4px solid black; border-bottom: 1px solid black; `;
            case "line":
                return css`border-bottom: 1px solid black;`;        
            default:
                break;
        }
    }};
`;
// ---------------------------------------------------/

// 3) ItemDiv
const ItemDiv = styled.div`
    display: inline-block;
    width: ${props => props.width || "10%"};    
    text-align: ${props => props.align || "center"};
    vertical-align: ${props => props.align || "center"};

    ${props => {
        const {stype} = props;

        switch (stype) {
            case "name":
                return css`                        
                    height: ${props => props.height || "30px"};
                    margin: ${props => props.margin || "0"};
                    font-weight: bold;
                    line-height: 30px;
                `;                
            default:
                break;
        }
    }} 
`;
// ---------------------------------------------------/

// [3] Collapse(Accordion) - With Bootstrap
// 1) StyledSubject: Accordion 제목
const StyledSubject = styled.div`
    display: block;
    padding: 0.5rem 1rem; 
    cursor: pointer;
    &:hover {
        color: #666;
    };
`;
// ---------------------------------------------------/

// [4] 페이징
// 1) PagingWrapper: 페이징관련 개체들 Wrapper
const PagingWrapper = styled.div`
    display: inline-block;
    position: relative;
    width: 100%;
    margin: 0 auto;
    margin-top: 10px;

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
    background-color: ${props => props.selectbtn ? "#c0c0c0" : "ffffff"};
`;
// ---------------------------------------------------/

// [5] QA 작성
// 1) QAWriteWrapper
const QAWriteWrapper = styled.div`            
    display: inline-block;                
    position: absolute;
    right: 60px;
    width: auto;
`;
// ---------------------------------------------------/

// 2) QAWriteLink, QA 작성폼으로 이동
const QAWriteLink = styled(CustomLink)`
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

// ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒

// [Component] ReviewQATable 
const ReviewQATable = (props) => {
    const {subjects, type, data, currentPage, pageCount, events} = props;        
    const {pagingBtnClick} = events;

    return (
        <TableWrapper>             
            <TableFrame visible = {!data && (typeof data.length === "undefined" || data.length <= 0)}>
                <LineDiv stype="TBline" empty>
                    <h5>{type === "review" ? "작성된 리뷰가 없습니다." : "작성된 Q&A가 없습니다."}</h5>
                </LineDiv>
            </TableFrame>

            <TableFrame visible = {data && data.length > 0}>
                <LineDiv stype="TBline">
                    {subjects &&
                        subjects.map((v, i) => {
                            let width =
                                type === 'review'
                                    ? v === '제목'
                                        ? '50%'
                                        : 50 / (subjects.length - 1) + '%'
                                    : v === '제목'
                                    ? '45%'
                                    : v === '날짜'
                                    ? '17.5%'
                                    : 50 / (subjects.length - 1) + '%';

                            return (
                                <ItemDiv
                                    key = {i}
                                    stype={'name'}
                                    width={width}                          
                                >
                                    {v}
                                </ItemDiv>
                            );
                        })}
                </LineDiv>
                        
                {data &&
                    data.map((v, i) => {
                        return (              
                            <Accordion key = {v.id}>
                                <LineDiv stype="line">
                                    <ItemDiv width={"12.5%"}>{v.RN}</ItemDiv>    
                                    {type === 'review' ? (
                                        <ItemDiv width={"12.5%"}>
                                            {v.picture ? (
                                                <FontAwesomeIcon
                                                    icon={faCamera}
                                                    size="sm"
                                                    color="#666"
                                                />
                                            ) : (
                                                ''
                                            )}
                                        </ItemDiv>
                                    ) : (
                                        <ItemDiv align="left" width={"45%"}>
                                            <Accordion.Toggle
                                                as={StyledSubject}
                                                variant="link"
                                                eventKey="this"
                                            >
                                                {v.subject}
                                            </Accordion.Toggle>
                                        </ItemDiv>
                                    )}    
                
                                    {type === 'review' ? (
                                        <ItemDiv align="left" width={"50%"}>
                                            <Accordion.Toggle
                                                as={StyledSubject}
                                                variant="link"
                                                eventKey="this"
                                            >
                                                {v.subject}
                                            </Accordion.Toggle>
                                        </ItemDiv>
                                        
                                    ) : (                                                                
                                        <ItemDiv align="center" width={"12.5%"}>{v.userDisplayId}</ItemDiv>                                        
                                    )}

                                    <ItemDiv align="center" width={type === 'review' ? "12.5%" : "17.5%"}>
                                        {type === 'review' ? v.userDisplayId : new Date(v.createdAt).toLocaleString()}
                                    </ItemDiv>
                                    <ItemDiv align="center" width={"12.5%"}>
                                        {type === 'review' ? v.rate : v.view}
                                    </ItemDiv>    
                                     
                                    <Accordion.Collapse eventKey="this">
                                        <ContentView
                                            content={v.content}
                                            style={{
                                                // display: "block",
                                                margin: '10px 0',
                                                boxShadow: '0 0 0 0.1px',
                                                padding: "1rem",
                                            }}
                                        />
                                    </Accordion.Collapse>
                                </LineDiv> 
                            </Accordion>                                                                           
                        );
                    })
                }
            </TableFrame>
            


            <PagingWrapper>
                {(pageCount > 0) &&                    
                    [...Array(pageCount)].map((v, i) => {   // map대신 for문 쓰고 싶을 때
                        let index = (i+1);
                        let selectbtn = (index === Number(currentPage));
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
                    
            {type === "qa" && (
                <QAWriteWrapper>
                    <QAWriteLink to="/write/qa">{"Q&A 작성"}</QAWriteLink>  
                </QAWriteWrapper>
            )}

                
            </PagingWrapper>
            
        </TableWrapper>
    );
};

export default ReviewQATable;

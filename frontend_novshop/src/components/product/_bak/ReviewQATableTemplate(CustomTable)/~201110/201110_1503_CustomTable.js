// 201110_1503 메모
// DB (review, qa) sequelize raw query를 쓰지 않고 사용할 때, 이 파일 사용.

import React from 'react';
import styled, { css } from 'styled-components';
import { getSize } from '../../lib/utility/customFunc';
import { cssDisplayNone } from '../../components/common/StyleUtilCSS';
// import { CustomLink } from '../../components/common/StyleUtilModels';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';       // fas
import { Accordion } from 'react-bootstrap';

// ========================================================================================
// [default] CustomTable    START
// ========================================================================================
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

// 2) StyledContent: Accordion 내용
const StyledContent = styled.div`
    display: block;
    padding: 0.5rem 1rem;    
`;
// ---------------------------------------------------/




// [Component - default] CustomTable 
const CustomTable = (props) => {
    const {subjects, type, data} = props;

    return (
        <TableWrapper> 

            <TableFrame visible = {data && !data.length > 0}>
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
                            <Accordion>
                                <LineDiv stype="line">
                                    <ItemDiv width={"12.5%"}>{v.id}</ItemDiv>    
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
                                        <ItemDiv align="center" width={"12.5%"}>{v.userId}</ItemDiv>
                                    )}

                                    <ItemDiv align="center" width={type === 'review' ? "12.5%" : "17.5%"}>
                                        {type === 'review' ? v.userId : v.dateinfo}
                                    </ItemDiv>
                                    <ItemDiv align="center" width={"12.5%"}>
                                        {type === 'review' ? v.rate : v.view}
                                    </ItemDiv>    
                                     
                                    <Accordion.Collapse eventKey="this">
                                        <StyledContent>
                                            <div>
                                                {v.content}                                                
                                            </div>
                                            <div>
                                                <img
                                                    alt="임시"
                                                    src={'/images/200720.jpg'}
                                                    width="100%"                                                    
                                                />
                                            </div>
                                        </StyledContent>
                                    </Accordion.Collapse>
                                </LineDiv> 
                            </Accordion>                                                                           
                        );
                    })
                }
            </TableFrame>
        </TableWrapper>
    );
};

export default CustomTable;

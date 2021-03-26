import React from 'react';
import styled, { css } from 'styled-components';
import { getSize } from '../../lib/utility/customFunc';
// import { CustomLink } from '../../components/common/StyleUtilModels';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';       // fas
import { Accordion } from 'react-bootstrap';


// ========================================================================================
// [private] CollapseContent    START
// ========================================================================================
const StyledSubject = styled.div`
    display: block;
    padding: 0.5rem 1rem; 
    cursor: pointer;
    &:hover {
        color: #666;
    };
`;

const StyledContent = styled.div`
    display: block;
    padding: 0.5rem 1rem;    
`;
// ---------------------------------------------------/

// [Component] CollapseContent, 제목을 눌렀을때 가려져있던 내용들이 나타남 (with Bootstrap)
const CollapseContent = (props) => {
    const {subject, content} = props;
    return (
        <Accordion>
            <Accordion.Toggle as={StyledSubject} variant="link" eventKey="this">    {/* eventKey가 같은걸 보여줌 */}
                {subject}
            </Accordion.Toggle>            
            <Accordion.Collapse eventKey="this">
                <StyledContent>
                    <div>
                        {content} Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit, sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat. Duis aute irure dolor in reprehenderit in
                        voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        Excepteur sint occaecat cupidatat non proident, sunt in
                        culpa qui officia deserunt mollit anim id est laborum.                    
                    </div>
                    <div>
                    <img
                        alt="임시"                                        
                        src={"/images/200720.jpg"}                    
                        width="100%"
                        // height={imageTagHeight()} // 비활성. 굳이..
                    />
                    </div>
                </StyledContent>
            </Accordion.Collapse>
        </Accordion>
    );
};



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
`;
// ---------------------------------------------------/

// 2) LineDiv
const LineDiv = styled.div`
    width: 100%;
    ${props => {
        const {stype} = props;
        switch (stype) {
            case "TBline":                
                return css`border-top: 4px solid black; border-bottom: 1px solid black; `;
            case "line":
                return css`border-bottom: 1px solid black;`
        
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



// [Component - default] CustomTable 
const CustomTable = (props) => {
    const {subjects, type, data} = props;
    
    let dataTmp = data || (
        [
            {
                id: 1,                      
                sub: '테스트1 QA',
                author: 'TEST1',
                date: Date.now(),
                view: 13,
            },
            {
                id: 2,                      
                sub: '테스트2 QA',
                author: 'TEST2',
                date: Date.now(),
                view: 14,
            },
            {
                id: 3,                      
                sub: '테스트3 QA',
                author: 'TEST3',
                date: Date.now(),
                view: 15,
            },
        ]
    );

    return (
        <TableWrapper> 
            <TableFrame>
                <LineDiv stype="TBline">
                    {subjects &&
                        subjects.map((v, i) => {
                            let width =
                                v === '제목'
                                    ? '50%'
                                    : 50 / (subjects.length-1) + '%';
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

                {dataTmp &&
                    dataTmp.map((v, i) => {
                        return (                            
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
                                    <ItemDiv width={"50%"} align="left">{v.sub}</ItemDiv>
                                )}    
             
                                {type === 'review' ? (
                                    <ItemDiv align="left" width={"50%"}>
                                        <CollapseContent
                                            subject={v.subject}
                                            content={v.content}
                                        />
                                    </ItemDiv>
                                ) : (                                                                
                                    <ItemDiv align="center" width={"12.5%"}>{v.author}</ItemDiv>
                                )}

                                <ItemDiv align="center" width={"12.5%"}>
                                    {type === 'review' ? v.userId : v.date}
                                </ItemDiv>
                                <ItemDiv align="center" width={"12.5%"}>
                                    {type === 'review' ? v.rate : v.view}
                                </ItemDiv>    
                            </LineDiv>                                                                                 
                        );
                    })
                }
            </TableFrame>
        </TableWrapper>
    );
};

export default CustomTable;

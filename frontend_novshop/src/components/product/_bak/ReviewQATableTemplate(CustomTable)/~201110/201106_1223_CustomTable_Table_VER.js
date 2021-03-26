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

// [2] Styled된 테이블 관련 요소    
// 1) Table
const StyledTable = styled.table`
    /* margin: 0 auto; */
    margin: 0 5%;
    width: 90%;
    border-top: 4px solid black;
`;
// ---------------------------------------------------/

// 2) Th
const StyeldTh = styled.th`
    width: ${(props) => props.width && props.width};
    border-bottom: 2px solid gray;
    height: 40px;

    text-align: center;
    align-items: center;
    justify-content: center;        
`;
// ---------------------------------------------------/

// 3) Td
const StyeldTd = styled.td`    
    width: ${(props) => props.width && props.width};
    border-bottom: 1px solid #575757;
    height: 30px;

    ${(props) => {
        let { align } = props;            
        align = align || 'center';
        
        return css`
            text-align: ${align};
            align-items: ${align};
            justify-content: ${align};
        `;
    }};
`;
// ---------------------------------------------------/


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

            {/* div table 테스트중.. */}
            <div style={{borderTop: "1px solid black", borderBottom: "1px solid black", width: "100%", margin: "0 auto",}}>
                테스트
            </div>
            <br/>


            <StyledTable>
                <thead>
                    <tr>
                        {subjects && 
                            subjects.map((v, i) => {
                                let width = v === "제목" ? "50%" : ((50/subjects.length-1).toString + "%");
                                return <StyeldTh width={width}>{v}</StyeldTh>
                            })  
                        }
                    </tr>
                </thead>               
                <tbody>
                    {dataTmp && 
                        dataTmp.map((v, i) => {
                            return(
                                <tr>
                                    <StyeldTd>{v.id}</StyeldTd>                                    
                                    {type === 'review' ? (
                                        <StyeldTd>
                                            {v.picture ? (
                                                <FontAwesomeIcon
                                                    icon={faCamera}
                                                    size="sm"
                                                    color="#666"
                                                />
                                            ) : (
                                                ''
                                            )}
                                        </StyeldTd>
                                    ) : (
                                        <StyeldTd align="left">
                                            {v.sub}
                                        </StyeldTd>
                                    )}
                                    <StyeldTd
                                        align={
                                            type === 'review'
                                                ? 'left'
                                                : 'center'
                                        }
                                    >
                                        {type === 'review' ? (
                                            <CollapseContent subject={v.subject} content={v.content}/>
                                        ) : (
                                            v.author
                                        )}
                                    </StyeldTd>      
                                    <StyeldTd>
                                        {type === 'review' ? v.userId : v.date}
                                    </StyeldTd>       
                                    <StyeldTd>
                                        {type === 'review' ? v.rate : v.view}
                                    </StyeldTd>                                                                                                               
                                </tr>
                            )
                        })
                    }                    
                </tbody>                
            </StyledTable>
        </TableWrapper>
    );
};

export default CustomTable;

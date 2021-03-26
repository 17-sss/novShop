import React from 'react';
import styled, { css } from 'styled-components';
import { getSize } from '../../lib/utility/customFunc';
// import { CustomLink } from '../../components/common/StyleUtilModels';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';       // fas

const TableWrapper = styled.div`
    width: ${(props) => props.width || getSize(1.4)};
    margin: 0 auto;
`;

const StyledTable = styled.table`
    /* margin: 0 auto; */
    margin: 0 5%;
    width: 90%;
    border-top: 4px solid black;
`;

const StyeldTh = styled.th`
    width: ${(props) => props.width && props.width};
    border-bottom: 2px solid gray;
    height: 40px;

    text-align: center;
    align-items: center;
    justify-content: center;        
`;

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
    
    /*
    let items =
        type === 'review'
            ? [
                  {
                      num: 1,
                      pic: false,
                      sub: '테스트1',
                      author: 'TEST1',
                      grade: 3,
                  },
                  {
                      num: 2,
                      pic: true,
                      sub: '테스트2',
                      author: 'TEST2',
                      grade: 4,
                  },
                  {
                      num: 3,
                      pic: false,
                      sub: '테스트3',
                      author: 'TEST3',
                      grade: 5,
                  },
              ]
            : [
                  {
                      num: 1,                      
                      sub: '테스트1 QA',
                      author: 'TEST1',
                      date: Date.now(),
                      view: 13,
                  },
                  {
                      num: 2,                      
                      sub: '테스트2 QA',
                      author: 'TEST2',
                      date: Date.now(),
                      view: 14,
                  },
                  {
                      num: 3,                      
                      sub: '테스트3 QA',
                      author: 'TEST3',
                      date: Date.now(),
                      view: 15,
                  },
              ];
    */

    return (
        <TableWrapper>
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
                                    <StyeldTd align={type === 'review' ? "left" : "center"}>
                                        {type === 'review' ? v.subject : v.author}
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

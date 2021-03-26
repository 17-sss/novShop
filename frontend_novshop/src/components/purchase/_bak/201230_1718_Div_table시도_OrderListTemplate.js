import React from 'react';
import styled, { css } from 'styled-components';
import { getSize } from '../../lib/utility/customFunc';
import { CommonTableMultiWrapper } from '../common/CommonTableComponents';

const OrderListWrapper = styled.div`
    width: ${getSize(1.65)};
    margin: 0 auto;
`;

const OrderListMultiWrapper = styled(CommonTableMultiWrapper)`
    ${(props) =>
        props.stype === 'table' &&
        css`
            div.listWrap {
                width: 100%;
                border-top: 1px solid #e3e3e3;
                border-bottom: 1px solid #e3e3e3;

                div.table {
                    display: table; // <table>
                    margin: 5px auto;
                    
                    div.thead {
                        width: 100%;
                        background-color: #fbfafa;
                        display: table-header-group;    // <thead>
                    }

                    div.tbody {
                        width: 100%;                                                
                        display: table-row-group;       // <tbody>
                    }

                    div.tr {
                        display: table-row; // <tr>                        
                    }

                    span.th {  // <th> 처럼 디자인
                        display: table-cell;                        
                        font-size: 15px;
                        font-weight: bold;
                        text-align: center;
                    }

                    span.td {       
                        display: table-cell;    // <td> 
                        font-size: 15px;
                    }
                }

                // -------------------
                div.contents {                    
                    width: 100%;
                    height: 200px;
                    background-color: blue;
                }
            }
        `}
`;

const OrderListTemplate = () => {
    return (
        <OrderListWrapper>
            <OrderListMultiWrapper
                stype="pagename"
                style={{ margin: '50px 0 20px' }}
            >
                <p id="pageType">주문 내역</p>
            </OrderListMultiWrapper>
            <OrderListMultiWrapper stype="table">
                <div className="listWrap">

                    <div className="table">           
                        <colgroup>
                            <col style={{ width: '20%' }}/>
                            <col style={{ width: '20%' }}/>
                            <col style={{ width: '20%' }}/>
                            <col style={{ width: '20%' }}/>
                            <col style={{ width: '20%' }}/>
                        </colgroup>             
                        <div className="thead">
                            <div className="tr">
                                <span className="th">주문일자</span>
                                <span className="th">이미지</span>
                                <span className="th">상품정보</span>
                                <span className="th">수량</span>
                                <span className="th">상품구매금액</span>
                                {/* <span className="cell">주문처리상태</span> // 택배 운송장 등 */}
                            </div>
                        </div>
                    </div>
                    
                    <div className="contents">드롭다운</div>
                    
                    <div className="table">        
                        <colgroup>
                            <col style={{ width: '20%' }}/>
                            <col style={{ width: '20%' }}/>
                            <col style={{ width: '20%' }}/>
                            <col style={{ width: '20%' }}/>
                            <col style={{ width: '20%' }}/>
                        </colgroup>
                        <div className="tbody">
                            <div className="tr">
                                <span className="td">20201230</span>
                                <span className="td">Image</span>
                                <span className="td">Info</span>
                                <span className="td">1</span>
                                <span className="td">200,000</span>
                                {/* <span className="cell">주문처리상태</span> // 택배 운송장 등 */}
                            </div>                                                    
                        </div>
                    </div>

                    <div className="contents">드롭다운</div>

                    <div className="table">        
                        <div className="tbody">
                            <div className="tr">
                                <span className="td">20201230</span>
                                <span className="td">Image</span>
                                <span className="td">Info</span>
                                <span className="td">1</span>
                                <span className="td">200,000</span>
                                {/* <span className="cell">주문처리상태</span> // 택배 운송장 등 */}
                            </div>                                                    
                        </div>
                    </div>

                    <div className="contents">드롭다운</div>

                </div>

                    
                
            </OrderListMultiWrapper>
        </OrderListWrapper>
    );
};

export default OrderListTemplate;

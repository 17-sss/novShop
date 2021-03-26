import React from 'react';
import styled, { css } from 'styled-components';
import { SubjectLink } from '../common/CommonTableComponents';
import { TransparentBtn } from '../common/StyleUtilModels'
import { getSize, threeDigitsComma } from '../../lib/utility/customFunc';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';       // fas
import { Accordion } from 'react-bootstrap';
import { cssDisplayNone, cssStrike } from '../common/StyleUtilCSS';

// 1. Wrapper 
// 1) 전체 Wrapper 
const OrderListWrapper = styled.div`
    width: ${getSize(1.65)};
    margin: 0 auto;
`;

// 2) MultiWrapper
const OrderListMultiWrapper = styled.div`
    width: 100%;

    ${(props) =>
        props.stype === 'pagename'
            ? css`
                  min-height: 30px;
                  margin: 50px 0 20px;
                  border-bottom: 0;
                  text-align: center;

                  p {
                      font-weight: 100;
                      color: #222;
                      font-size: 20px;
                  }
              `
            : props.stype === 'tableDiv'
            ? css`
                  border-top: 1px solid #e3e3e3;
                  border-bottom: 1px solid #e3e3e3;
                  margin: 20px auto;
              `
            : props.stype === 'headRow'
            ? css`
                  height: 30px;
                  background-color: #fbfafa;
                  border-bottom: 1px solid #e3e3e3;

                  ${OrderListCell} {
                      padding: 5px 0;
                      margin: 0 0.5%;
                      font-weight: bold;
                      font-size: 15px;
                  }
              `
            : props.stype === 'dataRow' &&
              css`
                  border-bottom: 1px solid #f3f3f3;

                  ${OrderListCell} {
                      padding: 5px 0;
                      margin: 0 5px;
                      font-size: 13px;
                  }
              `}
`;
// -------------------------

// 2-1. 테이블 느낌나게 만든 태그들 -> 일반적으로 보이는 부분임 (Accordion 아님)
// 1) 테이블의 td나 th 느낌
const OrderListCell = styled.span`
    display: inline-block;
    width: ${(props) => (props.width ? props.width : '10%')};
    text-align: ${(props) => (props.align ? props.align : 'center')};
    vertical-align: middle;
`;

// 2) 상품정보 부분의 내용을 분리하기 위함 (주문 상세정보 Btn & 일반정보)
const OrderListProdInfo = styled.div`
    display: inline-block;
    ${(props) =>
        props.stype === 'info'
            ? css`                  
                  width: 80%;
                  vertical-align: middle;
              `
            : props.stype === 'detail' &&
              css`                                    
                  width: 20%;
                  vertical-align: bottom;
                  text-align: center;
              `};
`;
// ----------

// 2-2. Accordion (주문 상세정보)
// 1) 주문 상세정보 버튼 (OrderListDetailWrapper(Accordion) 펼치는 용도)
const OrderListDetailBtn = styled(TransparentBtn)`
    color: #bdbdbd;
    font-weight: bold;    
    &:hover {
        color: #d6d6d6;
    }
`;

// 2) 주문 상세정보 Wrapper
const OrderListDetailWrapper = styled.div`
    width: 100%;    
    border-top: 1px solid #f6f6f6;
    
    div {                
        width: 85%;
        margin: 20px auto;
    }

    p.infoName {            
        font-size: 14px;            
        font-weight: bold;
    }
`;
// ----------

// 2-3. 주문 상세정보 틀안에서 쓰임 Table 관련
// 1) table
const OrderListDetailTable = styled.table`
    margin: 10px auto;
    width: 100%;
    border-bottom: 1px solid #dfdfdf;
`;

// 2) th
const OrderListDetailTh = styled.th`    
    ${(props) =>
        props.stype === 'orderProdInfos'
            ? css`
                  text-align: center;
                  padding: 11px 18px;
              `
            : css`
                  width: 20%;
                  font-weight: normal;
                  text-align: left;
                  padding: 11px 0 10px 18px;
              `};
    
    border: 1px solid #dfdfdf;
    color: #353535;
    background-color: #fbfafa;
`;

// 2) td
const OrderListDetailTd = styled.td`
    ${(props) =>
        props.stype === 'orderProdInfos'
            ? css`
                  text-align: ${props.txtAlign ? props.txtAlign : 'center'};
                  padding: 10px 30px;
                  border-left: 1px solid #dfdfdf;
                  border-right: 1px solid #dfdfdf;
                  border-bottom: 1px solid #dfdfdf;
                  ${ props.backColor && css`background-color: ${props.backColor};` };
              `
            : css`
                  width: 80%;
                  padding: 11px 10px 10px;
                  border-top: 1px solid #dfdfdf;
                  border-right: 1px solid #dfdfdf;
              `};
    color: #353535;
    vertical-align: middle;
`;
// ----------

// 2-4. 기타 (주문 상세정보 Table 관련 태그안에 쓰이는 태그들)
// 1) p
const OrderListDetailP = styled.p`
    ${(props) =>
        props.stype === 'strike'
            ? cssStrike
            : props.stype === 'displaynone'
            ? cssDisplayNone
            : css``};
`;
// -------------------------

// ===================================================================================

const OrderListTemplate = (props) => {
    const { orderItems, etc } = props;
    const { headDatas, orderProdHeadDatas } = etc;

    return (
        <OrderListWrapper>
            <OrderListMultiWrapper stype="pagename">
                <p>주문 내역</p>
            </OrderListMultiWrapper>

            <OrderListMultiWrapper stype="tableDiv">
                <OrderListMultiWrapper stype="headRow">
                    {headDatas &&
                        headDatas.map((v, i) => (
                            <OrderListCell width={v.width} key={i}>
                                {v.name}
                            </OrderListCell>
                        ))}
                </OrderListMultiWrapper>

                {orderItems &&
                    orderItems.map((v, i) => {
                        // 여기선 하나의 주문 데이터의 최상위 값만 가져옴. (주문했을 시, 주문한 아이템을 전부 한행에 가져오면 더러워질 듯)
                        const firstItem = v.items[0];

                        // 링크
                        const { categoryId, categorySub } = firstItem.product;

                        // 받는사람 정보
                        // 1) 주소
                        const { addressPostNo: receivePostNo, addressAddr1, addressAddr2 } = v.receiveInfo.address;
                        const receiveAddress = `${addressAddr1} ${addressAddr2}`;
                        // 2) 연락처
                        const { phoneNumSelect, phoneNum1, phoneNum2 } = v.receiveInfo.phonenumber;
                        const receivePhoneNumber = `${phoneNumSelect}-${phoneNum1}-${phoneNum2}`;
                        // ----

                        let aLink = '/shopping';
                        if (!categoryId && !categorySub) {
                            aLink = aLink + `?itemId=${firstItem.productId}`;
                        } else if (categoryId && !categorySub) {
                            aLink =
                                aLink +
                                `?main=${categoryId}&itemId=${firstItem.productId}`;
                        } else if (categoryId && categorySub) {
                            aLink =
                                aLink +
                                `?main=${categoryId}&sub=${categorySub}&itemId=${firstItem.productId}`;
                        }

                        const fixSizes =
                            '[' +
                                JSON.parse(firstItem.product.sizes).join(', ') +
                            ']';

                        return (
                            <OrderListMultiWrapper stype="dataRow" key={i}>
                                <Accordion> 
                                    <OrderListCell width={headDatas[0].width}>
                                        {v.createdAt.toLocaleDateString()}
                                    </OrderListCell>
                                    <OrderListCell width={headDatas[1].width}>
                                        <img
                                            style={{
                                                maxWidth: '120px',
                                            }}
                                            alt={firstItem.product.name}
                                            src={
                                                '/uploads/' +
                                                firstItem.product.image
                                            }
                                        />
                                    </OrderListCell>
                                    <OrderListCell
                                        width={headDatas[2].width}
                                        align="left"
                                    >                                                     
                                            <OrderListProdInfo stype="info">
                                                <ul>
                                                    <li>
                                                        <SubjectLink
                                                            to={aLink}
                                                            style={{
                                                                margin: '0',
                                                                padding: '0',
                                                            }}
                                                        >
                                                            {firstItem.product.name}
                                                        </SubjectLink>
                                                    </li>
                                                    <li>
                                                        <b>{fixSizes}</b>
                                                    </li>
                                                    <li>
                                                        <span className="lightgray">
                                                            [옵션: {firstItem.selcolor}{' '}
                                                            / {firstItem.selsize}]
                                                        </span>
                                                    </li>
                                                </ul>
                                            </OrderListProdInfo>
                                            <OrderListProdInfo stype="detail">
                                                <Accordion.Toggle as={OrderListDetailBtn} eventKey="detailInfo">                                                
                                                    주문 상세정보&nbsp;
                                                    <FontAwesomeIcon size="lg" icon={faCaretDown}/>                                                
                                                </Accordion.Toggle>
                                            </OrderListProdInfo>                                                                                                                                                                                                                       
                                        
                                    </OrderListCell>

                                    <OrderListCell
                                        width={headDatas[3].width}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        {threeDigitsComma(v.totalPrice) + '원'}
                                    </OrderListCell>

                                    <Accordion.Collapse eventKey="detailInfo">
                                        <OrderListDetailWrapper>
                                            {/* 주문 상세정보 : 주문 정보 */}
                                            {/* 코드스쿼드 힘드러.. */}
                                            <div>
                                                <p className="infoName">주문정보</p>
                                                <OrderListDetailTable summary="주문정보">                                                    
                                                    <tbody>
                                                        <tr>
                                                            <OrderListDetailTh scope="row">
                                                                주문번호
                                                            </OrderListDetailTh>
                                                            <OrderListDetailTd>
                                                                <span>{v.orderNumStr}</span>
                                                            </OrderListDetailTd>
                                                        </tr>
                                                        <tr>
                                                            <OrderListDetailTh scope="row">
                                                                주문일자
                                                            </OrderListDetailTh>
                                                            <OrderListDetailTd>
                                                                <span>{v.createdAt.toLocaleDateString()}</span>
                                                            </OrderListDetailTd>
                                                        </tr>
                                                        <tr>
                                                            <OrderListDetailTh scope="row">
                                                                주문자
                                                            </OrderListDetailTh>
                                                            <OrderListDetailTd>
                                                                <span>{v.orderInfo.username}</span>
                                                            </OrderListDetailTd>
                                                        </tr>
                                                        {/* 주문처리상태는 나중에... */}
                                                    </tbody>
                                                </OrderListDetailTable>
                                            </div>

                                            {/* 주문 상세정보 : 결제정보 */}
                                            <div>
                                                <p className="infoName">결제정보</p>
                                                <OrderListDetailTable summary="결제정보">
                                                    <tbody>
                                                        <tr>
                                                            <OrderListDetailTh scope="row">
                                                                총 주문금액
                                                            </OrderListDetailTh>
                                                            <OrderListDetailTd>
                                                                <span>{threeDigitsComma(v.allProductPrice)}원</span>
                                                            </OrderListDetailTd>
                                                        </tr>
                                                        <tr>
                                                            <OrderListDetailTh scope="row">
                                                                배송비
                                                            </OrderListDetailTh>
                                                            <OrderListDetailTd>
                                                                <span>{v.shippingFee ? `${threeDigitsComma(v.shippingFee)}원` : '무료'}</span>
                                                            </OrderListDetailTd>
                                                        </tr>
                                                        <tr>
                                                            <OrderListDetailTh scope="row">
                                                                총 결제금액
                                                            </OrderListDetailTh>
                                                            <OrderListDetailTd>
                                                                <span>{threeDigitsComma(v.totalPrice)}원</span>
                                                            </OrderListDetailTd>
                                                        </tr>
                                                    </tbody>
                                                </OrderListDetailTable>

                                            </div>

                                            {/* 주문 상세정보 : 주문 상품 정보 */}
                                            <div>
                                                <p className="infoName">주문 상품 정보</p>
                                                <OrderListDetailTable summary="주문 상품 정보">
                                                    <colgroup>
                                                        {orderProdHeadDatas.map((v, i) => (<col key={i} style={{width: v.width}}/>))}
                                                    </colgroup>
                                                    <thead>
                                                        <tr>
                                                            {orderProdHeadDatas.map(
                                                                (v, i) => (
                                                                    <OrderListDetailTh key={i} scope="col" stype="orderProdInfos">
                                                                        {v.name}
                                                                    </OrderListDetailTh>
                                                                ),
                                                            )}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {v.items.map((item, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <OrderListDetailTd stype="orderProdInfos">
                                                                        <img
                                                                            style={{
                                                                                maxWidth: '120px',
                                                                            }}
                                                                            alt={item.product.name}
                                                                            src={'/uploads/' + item.product.image}
                                                                        />                                                                                                                                    
                                                                    </OrderListDetailTd>
                                                                    <OrderListDetailTd stype="orderProdInfos" txtAlign="left">
                                                                        <ul>
                                                                            <li>
                                                                                <SubjectLink
                                                                                    to={aLink}
                                                                                    style={{
                                                                                        margin: '0',
                                                                                        padding: '0',
                                                                                    }}
                                                                                >
                                                                                    {item.product.name}
                                                                                </SubjectLink>
                                                                            </li>
                                                                            <li>
                                                                                <b>{fixSizes}</b>
                                                                            </li>
                                                                            <li>
                                                                                <span className="lightgray">
                                                                                    [옵션: {item.selcolor}{' '}
                                                                                    / {item.selsize}]
                                                                                </span>
                                                                            </li>
                                                                        </ul>
                                                                    </OrderListDetailTd>
                                                                    <OrderListDetailTd stype="orderProdInfos">
                                                                        {item.volume}
                                                                    </OrderListDetailTd>
                                                                    <OrderListDetailTd stype="orderProdInfos">                                                                        
                                                                        <OrderListDetailP stype={item.product.sale && 'strike'}>
                                                                            {threeDigitsComma(item.product.price)}원
                                                                        </OrderListDetailP>                                                                        
                                                                        <OrderListDetailP stype={item.product.sale || 'displaynone'}>
                                                                            {threeDigitsComma(item.product.price-(item.product.price * item.product.sale))}원
                                                                        </OrderListDetailP>                                                                        
                                                                    </OrderListDetailTd>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <OrderListDetailTd 
                                                                stype="orderProdInfos" 
                                                                txtAlign="right" 
                                                                colSpan={orderProdHeadDatas.length}
                                                                backColor={"#fbfafa"}
                                                            >
                                                                <span>                                                                    
                                                                    <span>
                                                                        <b>상품구매금액&nbsp;</b>                                           
                                                                        { threeDigitsComma(
                                                                            v.items.reduce((prev, curr) => {
                                                                                return (prev + (curr.product.price * curr.volume));
                                                                            }, 0)) }
                                                                    </span>
                                                                    &nbsp;+&nbsp; 
                                                                    <span>
                                                                        <b>배송비&nbsp;</b>
                                                                        <span>{v.shippingFee ? `${threeDigitsComma(v.shippingFee)}` : '무료'}</span>
                                                                    </span>
                                                                    &nbsp;-&nbsp;
                                                                    <span>
                                                                        <b>상품할인금액&nbsp;</b>
                                                                        { threeDigitsComma(
                                                                            v.items.reduce((prev, curr) => {
                                                                                return (prev + (curr.product.price * curr.product.sale) * curr.volume);
                                                                            }, 0)) }                                        
                                                                    </span>
                                                                    &nbsp;=&nbsp;
                                                                    <span>
                                                                        <b>합계:&nbsp;</b>
                                                                        { threeDigitsComma(
                                                                            v.items.reduce((prev, curr) => {
                                                                                return (
                                                                                    prev + 
                                                                                    (
                                                                                        ((curr.product.price * curr.volume) 
                                                                                        - (curr.product.price * curr.product.sale)
                                                                                        * curr.volume) 
                                                                                        + v.shippingFee
                                                                                    )
                                                                                );
                                                                            }, 0)) }원
                                                                    </span>
                                                                </span>
                                                            </OrderListDetailTd>
                                                        </tr>
                                                    </tfoot>
                                                </OrderListDetailTable>
                                            </div>

                                            {/* 주문 상세정보 : 배송지정보 */}
                                            <div>
                                                <p className="infoName">배송지정보</p>
                                                <OrderListDetailTable summary="배송지정보">
                                                    <tbody>
                                                        <tr>
                                                            <OrderListDetailTh scope="row">
                                                                받으시는 분
                                                            </OrderListDetailTh>
                                                            <OrderListDetailTd>
                                                                <span>{v.receiveInfo.username}</span>
                                                            </OrderListDetailTd>
                                                        </tr>
                                                        <tr>
                                                            <OrderListDetailTh scope="row">
                                                                우편번호
                                                            </OrderListDetailTh>
                                                            <OrderListDetailTd>
                                                                <span>{receivePostNo}</span>
                                                            </OrderListDetailTd>
                                                        </tr>
                                                        <tr>
                                                            <OrderListDetailTh scope="row">
                                                                주소
                                                            </OrderListDetailTh>
                                                            <OrderListDetailTd>
                                                                <span>{receiveAddress}</span>
                                                            </OrderListDetailTd>
                                                        </tr>
                                                        <tr>
                                                            <OrderListDetailTh scope="row">
                                                                연락처
                                                            </OrderListDetailTh>
                                                            <OrderListDetailTd>
                                                                <span>{receivePhoneNumber}</span>
                                                            </OrderListDetailTd>
                                                        </tr>
                                                        <tr>
                                                            <OrderListDetailTh scope="row">
                                                                배송메세지
                                                            </OrderListDetailTh>
                                                            <OrderListDetailTd>
                                                                {v.receiveInfo.deliveryMessage}
                                                            </OrderListDetailTd>
                                                        </tr>
                                                    </tbody>
                                                </OrderListDetailTable>
                                            </div>
                                        </OrderListDetailWrapper>
                                    </Accordion.Collapse>      
                                </Accordion>                             
                            </OrderListMultiWrapper>
                        );
                    })}
            </OrderListMultiWrapper>
        </OrderListWrapper>
    );
};

export default OrderListTemplate;

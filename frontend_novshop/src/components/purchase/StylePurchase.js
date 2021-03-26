import styled, { css } from 'styled-components';
import {    
    CommonTableMultiWrapper,
    StyledTable,
    StyledTh,
    StyledTd,
} from '../common/CommonTableComponents';
import { cssDisplayNone, cssStrike, cssTransparent } from '../common/StyleUtilCSS';

// [1 : import] Wrapper
// 1) PurchaseWrapper (as로 CommonTableWrapper 자체를 가져옴)
// 2) PurchaseMultiWrapper
const PurchaseMultiWrapper = styled(CommonTableMultiWrapper)`
    ${(props) => {
        const { stype, margin } = props;        
        return stype === 'totalinfo'
            ? css`
                  width: 100%;
                  padding: 1rem 0;
                  border-bottom: 1px solid #e3e3e3;
                  background-color: #fbfafa;

                  span.totalprice {
                      font-size: 11.5pt;
                  }
                  .shippingfeeInfo {
                      margin-top: 10px;
                      text-align: center;
                  }                  
              `
            : stype === 'buy' &&
                  css`
                      width: 100%;                                            
                      margin: ${margin ? margin : "0 0 30px 0"};
                      
                      .buyInfoWrap {
                          /* border-top: 1px solid #e3e3e3; */
                          padding: 10px 0;
                          margin-top: 20px;
                      }

                      .float_left {
                          display: inline-block;
                          float: left;
                      }
                      .float_right {
                          display: inline-block;
                          float: right;
                      }
                      span.required_star {
                          color: red;                          
                          font-size: 10pt;                      
                          padding: 0 3px;                          
                      }
                  `;
    }}
`;

// ---------------------------------------------------/

// [2] Table 관련
// 1-1) table (import)
const PurchaseTable = styled(StyledTable)`
    ${(props) =>
        props.mode === 'buy'
            ? css`
                  border: none;
              `
            : css`
                  border-top: 1px solid #e3e3e3;
                  border-bottom: 1px solid #e3e3e3;
              `}

    font-size: 10pt;
`;

// 1-2) th (import)
const PurchaseTh = styled(StyledTh)`
    ${(props) =>
        props.mode === 'buy'
            ? css`
                // 구매 창
                  border: none;
                  background-color: #f6f6f6;
                  font-size: 9pt;
              `
            : css`
                // 장바구니 창
                  height: 35px;
                  border-bottom: 1px solid #e3e3e3;
              `}    
`;

// 1-3) td (import)
const PurchaseTd = styled(StyledTd)`
    border-bottom: none;

    ul > li > span.lightgray {
        color: #a0a0a0;
    }

    // 수량 조절 버튼 불투명하게
    input[type='number'][name='volume'] {
        text-align: center;

        ::-webkit-inner-spin-button,
        ::-webkit-outer-spin-button {
            opacity: 1;
        }
    }
`;

// 2) PurchaseIsSaleP: 세일 여부에 따른 원가격표시
const PurchaseIsSaleP = styled.p`
    ${props => {
        const {sale} = props;
        const flag = (sale && sale > 0 && sale < 1);
        return flag ? cssStrike : cssDisplayNone;
    }}
`;


// ---------------------------------------------------/

// [3] 기타
// 1) button
const PurchaseBtn = styled.button`
    ${cssTransparent}
    display: inline-block;
    width: auto;
    height: 25px;

    ${(props) =>
        props.name === 'receiveInfoClean' ||
        props.name === 'orderInfoClean' ||
        props.name === 'orderReceiveSame'
            ? css`
                  margin-left: 5px;
              `
            : css`
                  margin-right: 10px;
              `}

    padding: 0 10px;

    border-radius: 2px;
    border: 1px solid #d1d1d1;

    background-color: ${(props) =>
        props.name === 'buyall' ||
        props.name === 'receiveInfoClean' ||
        props.name === 'orderInfoClean'
            ? '#c0c0c0'
            : 'white'};
    &:hover {
        background-color: ${(props) =>
            props.name === 'buyall' ||
            props.name === 'receiveInfoClean' ||
            props.name === 'orderInfoClean'
                ? '#d6d6d6'
                : '#e6e6e6'};
    }
`;


export { PurchaseMultiWrapper, PurchaseTable, PurchaseTh, PurchaseTd, PurchaseIsSaleP, PurchaseBtn };
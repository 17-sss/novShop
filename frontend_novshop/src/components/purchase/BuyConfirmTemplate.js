import React from 'react';
import styled, { css } from 'styled-components';
import { threeDigitsComma } from '../../lib/utility/customFunc';
import { cssTransparent } from '../../components/common/StyleUtilCSS';
import {
    PurchaseMultiWrapper,
    PurchaseTable,
    PurchaseTh,
    PurchaseTd,
    PurchaseIsSaleP,
} from './StylePurchase';
import {
    CommonTableWrapper as BuyConfirmWrapper,
    SubjectLink,
} from '../common/CommonTableComponents';

const BuyConfirmMultiWrapper = styled(PurchaseMultiWrapper)`
    ${(props) => {
        const { stype } = props;

        return (
            stype === 'btns' &&
            css`
                text-align: center;
                justify-content: center;
                align-items: center;
                margin: 10px auto;

                button {
                    ${cssTransparent};
                    width: fit-content;
                    height: 40px;
                    padding: 0 10px;
                    margin: 0 10px;

                    border-radius: 4px;
                    border: 1px solid #b2b2b2;
                    background-color: #e2e2e2;
                    color: #383838;

                    &:hover {
                        background-color: #e9e9e9;
                    }
                }
            `
        );
    }};
`;

const BuyConfirmTemplate = (props) => {
    const { etcs, data, events } = props;
    const { colInfo } = etcs;
    const { onMainGoClick } = events;

    return (
        <BuyConfirmWrapper>
            <BuyConfirmMultiWrapper stype="pagename">
                <p id="pageType">구매가 완료되었습니다</p>
            </BuyConfirmMultiWrapper>

            <BuyConfirmMultiWrapper stype="table">
                <PurchaseTable>
                    <colgroup>
                        {colInfo &&
                            colInfo.width.map((v, i) => (
                                <col style={{ width: v + '%' }} key={i} />
                            ))}
                    </colgroup>

                    <thead>
                        <tr style={{ backgroundColor: '#fbfafa' }}>
                            {colInfo &&
                                colInfo.value.map((v, i) => (
                                    <PurchaseTh scope="col" key={i}>
                                        {v}
                                    </PurchaseTh>
                                ))}
                        </tr>
                    </thead>

                    <tbody>
                        {data &&
                            data.items &&
                            data.items.length > 0 &&
                            data.items.map((v, i) => {
                                const {
                                    product: {
                                        image,
                                        name,
                                        price,
                                        sale,
                                        mileage,
                                        sizes,
                                        categoryId,
                                        categorySub,
                                    },
                                    /*id,*/ selcolor,
                                    selsize,
                                    volume,
                                    productId /* userId */,
                                } = v;

                                let aLink = '/shopping';
                                if (!categoryId && !categorySub) {
                                    aLink = aLink + `?itemId=${productId}`;
                                } else if (categoryId && !categorySub) {
                                    aLink =
                                        aLink +
                                        `?main=${categoryId}&itemId=${productId}`;
                                } else if (categoryId && categorySub) {
                                    aLink =
                                        aLink +
                                        `?main=${categoryId}&sub=${categorySub}&itemId=${productId}`;
                                }

                                const calcPrice = Math.round(
                                    price - price * sale,
                                );
                                const fixMile = threeDigitsComma(
                                    Math.round(mileage * volume),
                                );

                                return (
                                    <tr key={i}>
                                        <PurchaseTd>
                                            <div style={{ margin: '10px' }}>
                                                <img
                                                    style={{
                                                        maxWidth: '100px',
                                                    }}
                                                    alt={name}
                                                    src={
                                                        '/uploads/' + image ||
                                                        '/images/bymono_test1.webp'
                                                    }
                                                />
                                            </div>
                                        </PurchaseTd>
                                        <PurchaseTd align="left">
                                            <ul>
                                                <li>
                                                    <SubjectLink
                                                        to={aLink}
                                                        style={{
                                                            margin: '0',
                                                            padding: '0',
                                                        }}
                                                    >
                                                        {name}
                                                    </SubjectLink>
                                                </li>
                                                <li>
                                                    <b>
                                                        {'[' +
                                                            JSON.parse(
                                                                sizes,
                                                            ).join(', ') +
                                                            ']'}
                                                    </b>
                                                </li>
                                                <li>
                                                    <span className="lightgray">
                                                        [옵션: {selcolor} /{' '}
                                                        {selsize}]
                                                    </span>
                                                </li>
                                            </ul>
                                        </PurchaseTd>
                                        <PurchaseTd>
                                            <PurchaseIsSaleP sale={sale}>
                                                {threeDigitsComma(price)}원
                                            </PurchaseIsSaleP>
                                            <b>
                                                {sale && sale > 0 && sale < 1
                                                    ? threeDigitsComma(
                                                          calcPrice,
                                                      )
                                                    : threeDigitsComma(price)}
                                                원
                                            </b>
                                        </PurchaseTd>
                                        <PurchaseTd>{volume}</PurchaseTd>

                                        <PurchaseTd>{fixMile}</PurchaseTd>
                                        <PurchaseTd>
                                            <b>
                                                {threeDigitsComma(
                                                    calcPrice * volume,
                                                )}
                                                원
                                            </b>
                                        </PurchaseTd>
                                    </tr>
                                );
                            })}
                    </tbody>
                </PurchaseTable>

                <BuyConfirmMultiWrapper stype="totalinfo">                    
                    <div style={{ textAlign: "center" }}>
                        <span className="totalprice">
                            상품구매금액{' '}
                            <b>
                                {data && data.allProductPrice
                                    ? data.allProductPrice
                                    : 'ERR!!'}
                            </b>{' '}
                            + 배송비{' '}
                            <b>
                                {data && data.shippingFee
                                    ? data.shippingFee
                                    : 'ERR!!'}
                            </b>{' '}
                            = 합계 :{' '}
                            <b>
                                {data && data.totalPrice
                                    ? data.totalPrice
                                    : 'ERR!!'}
                            </b>
                            원
                        </span>
                        <br/>
                        <span style={{ color: 'skyblue' }}>
                            마일리지{' '}
                            <span style={{fontWeight: 'bold'}}> 
                                {data && data.totalPrice
                                    ? threeDigitsComma(
                                            Number(data.totalPrice.replace(',', '')) *
                                                0.01,
                                        )
                                    : 'ERR!!'}{' '}
                            </span>
                            적립되었습니다. 감사합니다.
                        </span>
                    </div>
                </BuyConfirmMultiWrapper>

            </BuyConfirmMultiWrapper>

            <BuyConfirmMultiWrapper stype="btns">
                <button onClick={onMainGoClick}>메인으로</button>
            </BuyConfirmMultiWrapper>

        </BuyConfirmWrapper>
    );
};

export default BuyConfirmTemplate;

import { css } from 'styled-components';

// cssStrike: 글자에 취소선 긋기
const cssStrike = css`
    text-decoration: line-through;
    font-weight: normal;
`;

// cssDisplayNone: Display None
const cssDisplayNone = css`
    display: none !important;
`;

// cssCustomInput: input 디자인
const cssCustomInput = css`
    ${(props) => {
        const { stylecss, addcss, type } = props;

        let defaultcss = '';
        switch (type) {
            case 'color': {
                defaultcss = css`
                    width: 100%;
                    border: none;
                    height: 40px;
                    margin: 0;
                    padding: 0;
                `;
                break;
            }

            case 'submit':
            case 'button': {
                defaultcss = css`
                    border: none;
                    font: inherit;
                    cursor: pointer;
                    outline: inherit;

                    padding: 0.5rem;
                    font-size: 16px;
                    color: white;
                    background-color: rgb(170, 170, 170);
                    border-radius: 2px;

                    &:hover {
                        background-color: rgb(150, 150, 150);
                    }
                `;
                break;
            }

            default: {
                defaultcss = css`
                    width: 100%;
                    margin-top: 1%;
                    padding-bottom: 0.5rem;
                    font-size: 16px;

                    border: none;
                    border-bottom: 1px solid rgb(233, 233, 233);
                    outline: none;

                    &:focus {
                        border-bottom: 1px solid rgb(209, 209, 209);
                    }
                `;
                break;
            }
        }

        if (!stylecss) {
            if (addcss) return defaultcss + addcss;
            else return defaultcss;
        } else {
            if (addcss) return stylecss + addcss;
            else return stylecss;
        }
    }}
`;

// cssCustomSpan: span 디자인
const cssCustomSpan = css`
    ${(props) =>
        props.css ||
        css`
            font-size: 12px;
            margin: 0 10px 0 0;
        `};

    color: ${(props) => props.color && props.color};
    font-weight: bold;

    &:hover {
        cursor: pointer;
    }
`;

/* 
    1. cssCustomInput, cssCustomSpan
        - CreateProductRelatedTemplate.js 에서 쓰임.
*/


// cssTransparent: input type(btn), button 태그 투명
const cssTransparent = css`
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
`;
export { cssStrike, cssDisplayNone, cssCustomInput, cssCustomSpan, cssTransparent };

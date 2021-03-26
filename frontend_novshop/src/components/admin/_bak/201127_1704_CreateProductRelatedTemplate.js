import React from 'react';
import styled, { css } from 'styled-components';
import { cssCustomInput, cssCustomSpan } from '../common/StyleUtilCSS';
import { getSize, randomColor } from '../../lib/utility/customFunc';
import QuillContainer from '../../containers/write/QuillContainer';

// [1] Wrapper
// 1) 최상위 Wrapper
const CreateProductRelatedWrapper = styled.div`
    width: ${getSize(1.45)};
    margin: 0 auto;
`;

// 2) 다용도 Wrapper
const MultiWrapper = styled.div`
    width: 100%;

    ${(props) => {
        const { stype } = props;
        return (
            stype === 'buttons' &&
            css`
                text-align: center;
                align-items: center;
                justify-content: center;
            `
        );
    }}
`;

// 3) 상품 - 색상, 사이즈 || 카테고리-소분류 정보 등 추가한 결과물들을 보여주는 ResultSpan를 위한 Wrapper
const ResultSpanWrapper = styled.div`
    width: 100%;
    height: auto;
    word-break: break-all; /* 텍스트가 div영역을 나가버려서 추가. */
    margin-bottom: 10px;
`;
// ---------------------------------------------------/

// [2] 각종 Tag
// 1) Input
const Input = styled.input`
    /* 
        [!] 현재 폼에서 Input 태그 type이 button일 경우,
            상품 - 색상, 사이즈 || 카테고리-소분류 정보 등 작성한 값을 확정하여 
            (리덕스) colors, sizes 등에 전달하는 버튼으로 사용
    */
    ${cssCustomInput}
    ${(props) =>
        props.type === 'submit'
            && css`
                  width: 70px;
                  height: 40px;
                  margin: 14px 0;
                  color: #212121;

                  background-color: #cccfd1;
                  border-radius: 2px;
                  box-shadow: 0.2px 0.2px 0.2px 0.2px lightgray;
              `};
`;

// 2) TextArea
const TextArea = styled.textarea`
    ${cssCustomInput}
`;

// 3) StyledP: Styled된 p 태그
const StyledP = styled.p`
    font-size: 16px;
    color: rgb(163, 163, 163);
    margin: ${(props) => props.margin || '8px 0px 4px 0px'};
`;

// 4-1) SelectBox: 분류 선택용 콤보박스 (select)
const SelectBox = styled.select`
    ${cssCustomInput};
    width: 50%;
    color: rgb(163, 163, 163);
`;

// 4-2) StyledOpt: select 태그의 option 태그
const StyledOpt = styled.option`
    color: ${(props) => props.noblack || 'black'};
`;

// 5) ResultSpan: 상품 - 색상, 사이즈 || 카테고리-소분류 정보 등 추가한 결과물들을 보여주는 Span
// randomcolor 사용하기에 attrs 사용.
const ResultSpan = styled.span.attrs(
    (props) =>
        props.randomColor && {
            style: {
                color: randomColor(),
            },
        },
)`
    ${cssCustomSpan}
`;
/*
// 일반 styled
const ResultSpan = styled.span`
    ${cssCustomSpan}
    ${props => props.randomColor && css`
        color: ${randomColor()};
    `}
`;
*/
// ---------------------------------------------------/


const CreateProductRelatedTemplate = (props) => {
    const {
        ctrlpage,
        onChange,
        onDelete,
        onSubmit,
        errorMessage,
        categoryForm,
        productForm,
        categories,
        subCategories,
    } = props;

    return (
        <CreateProductRelatedWrapper>
            <MultiWrapper>
                <form onSubmit={onSubmit} encType="multipart/form-data">
                    <Input
                        type="text"
                        name={ctrlpage === 'createproduct' ? 'name' : 'key'}
                        placeholder={
                            ctrlpage === 'createproduct'
                                ? '상품명'
                                : '카테고리 Key (영문, 숫자)'
                        }
                        onChange={onChange}
                        value={
                            ctrlpage === 'createproduct'
                                ? productForm.name
                                : categoryForm.key
                        }
                    />

                    <Input
                        type={ctrlpage === 'createproduct' ? 'file' : 'text'}
                        accept={
                            ctrlpage === 'createproduct' ? 'image/*' : undefined
                        }
                        name={
                            ctrlpage === 'createproduct'
                                ? 'image'
                                : 'displayValue'
                        }
                        placeholder={
                            ctrlpage === 'createproduct'
                                ? '상품 이미지 경로 (불러오기)'
                                : '페이지에 보일 값'
                        }
                        onChange={onChange}
                        value={
                            ctrlpage === 'createproduct'
                                ? productForm.image
                                : categoryForm.displayValue
                        }
                    />

                    {ctrlpage === 'createproduct' ? (
                        <>
                            <Input
                                type="text"
                                name="size"
                                placeholder="상품 사이즈"
                                onChange={onChange}
                                value={productForm.size}
                                addcss={css`
                                    width: 95%;
                                    margin-top: 16px;
                                `}
                            />
                            <Input
                                type="button" // button
                                name="insertSizes"
                                value="+"
                                onClick={onChange}
                                addcss={css`
                                    width: 5%;
                                `}
                            />
                            <ResultSpanWrapper id="p_sizes">
                                {productForm.sizes &&
                                    productForm.sizes.map((v, i) => {
                                        return (
                                            <ResultSpan
                                                key={i}
                                                onClick={onDelete}
                                            >
                                                {v}
                                            </ResultSpan>
                                        );
                                    })}
                            </ResultSpanWrapper>
                        </>
                    ) : (
                        <>
                            <Input
                                type="text"
                                name="itemKey"
                                placeholder="소분류 Key (영문, 숫자)"
                                onChange={onChange}
                                value={categoryForm.itemKey}
                                addcss={css`
                                    width: 47.5%;
                                    margin-top: 16px;
                                `}
                            />
                            <Input
                                type="text"
                                name="itemValue"
                                placeholder="소분류 value"
                                onChange={onChange}
                                value={categoryForm.itemValue}
                                addcss={css`
                                    width: 47.5%;
                                    margin-top: 16px;
                                `}
                            />
                            <Input
                                type="button" // button
                                name="insertItems"
                                value="+"
                                onClick={onChange}
                                addcss={css`
                                    width: 5%;
                                `}
                            />
                            <ResultSpanWrapper id="c_items">
                                {categoryForm.items &&
                                    categoryForm.items.map((v) => {
                                        return (
                                            <ResultSpan
                                                key={v.id}
                                                randomColor
                                                onClick={onDelete}
                                            >
                                                {v.key} &amp; {v.value}
                                            </ResultSpan>
                                        );
                                    })}
                            </ResultSpanWrapper>
                        </>
                    )}

                    {ctrlpage === 'createproduct' && (
                        <>
                            <>
                                <StyledP posTop>색상</StyledP>
                                <Input
                                    type="color"
                                    name="color"
                                    onChange={onChange}
                                    value={productForm.color}
                                    addcss={css`
                                        width: 44.5%;
                                        margin-right: 3%;
                                    `}
                                />
                                <Input
                                    type="text"
                                    name="colorName"
                                    placeholder="보여질 색상 이름"
                                    onChange={onChange}
                                    value={productForm.colorName}
                                    addcss={css`
                                        width: 47.5%;
                                        position: relative;
                                        top: -10px;
                                    `}
                                />
                                <Input
                                    type="button" // button
                                    name="insertColors"
                                    value="+"
                                    onClick={onChange}
                                    addcss={css`
                                        width: 5%;
                                        position: relative;
                                        top: -10px;
                                    `}
                                />
                                <ResultSpanWrapper id="p_colors">
                                    {productForm.colors &&
                                        productForm.colors.map((v, i) => {
                                            return (
                                                <ResultSpan
                                                    key={i}
                                                    color={v.key}
                                                    onClick={onDelete}
                                                >
                                                    {`${v.key} & ${v.value}`}
                                                </ResultSpan>
                                            );
                                        })}
                                </ResultSpanWrapper>
                            </>

                            <StyledP margin="8px 0 0 0">가격</StyledP>
                            <Input
                                type="number"
                                name="price"
                                min="1000"
                                max="9999999"
                                onChange={onChange}
                                value={productForm.price}
                            />
                            <StyledP margin="8px 0 0 0">
                                세일가 (할인율)
                            </StyledP>
                            <Input
                                type="number"
                                name="sale"
                                min="0"
                                max="100"
                                onChange={onChange}
                                value={productForm.sale}
                            />
                            <TextArea
                                name="description"
                                rows="2"
                                /* cols="50" */
                                placeholder="부가설명"
                                onChange={onChange}
                                value={productForm.description}
                                style={{ width: '100%' }}
                            />
                            <SelectBox
                                name="categoryId"
                                onChange={onChange}
                                value={productForm.categoryId || 0}
                            >
                                <StyledOpt value={0} noblack disabled>
                                    카테고리 대분류 선택
                                </StyledOpt>
                                {categories &&
                                    categories.map((v) => {
                                        return (
                                            <StyledOpt key={v.id} value={v.id}>
                                                {v.displayValue}
                                            </StyledOpt>
                                        );
                                    })}
                            </SelectBox>
                            <SelectBox
                                name="categorySub"
                                onChange={onChange}
                                disabled={
                                    !(
                                        subCategories &&
                                        subCategories.items.length > 0
                                    )
                                }
                                value={productForm.categorySub || 0}
                            >
                                <StyledOpt value={0} noblack disabled>
                                    카테고리 소분류 선택
                                </StyledOpt>
                                {subCategories &&
                                    subCategories.items.map((v) => {
                                        return (
                                            <StyledOpt key={v.id} value={v.id}>
                                                {v.displayValue}
                                            </StyledOpt>
                                        );
                                    })}
                            </SelectBox>

                            <QuillContainer
                                reduxCustomform={{
                                    formdata: productForm,
                                    formname: 'productForm',
                                }}
                            />
                        </>
                    )}

                    <MultiWrapper stype="buttons">
                        {errorMessage && (
                            <p style={{ color: 'red' }}>{errorMessage}</p>
                        )}
                        <Input type="submit" value="전송" />
                    </MultiWrapper>
                </form>
            </MultiWrapper>
        </CreateProductRelatedWrapper>
    );
};

export default CreateProductRelatedTemplate;

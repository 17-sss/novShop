import React from 'react';
import styled, { css } from 'styled-components';
import { cssCustomInput, cssCustomSpan } from '../common/StyleUtilCSS';
import { ClearEx } from '../common/StyleUtilModels';
import { getSize, randomColor } from '../../lib/utility/customFunc';
import QuillContainer from '../../containers/write/QuillContainer';

// [1] Wrapper
// 1) 최상위 Wrapper
const ManageForProductWrapper = styled.div`
    width: ${getSize(1.45)};
    margin: 0 auto;
`;

// 2) 다용도 Wrapper
const MultiWrapper = styled.div`
    width: 100%;

    ${(props) => {
        const { stype } = props;
        return stype === 'buttons'
            ? css`
                  text-align: center;
                  align-items: center;
                  justify-content: center;
              `
            : stype === 'inputs'
            ? css`
                  width: 100%;
                  padding: 2% 10%;
                  box-shadow: 0 0 0 0.2px;
                  margin: 2% 0;
              `
            : stype === 'pagename'
            ? css`
                  min-height: 30px;
                  margin: 50px 0 20px;
                  border-bottom: 0;
                  text-align: center;

                  p#pageType {
                      font-weight: 100;
                      color: #222;
                      font-size: 20px;
                  }
              `
            : stype === 'input_row'
            ? css`
                  width: 100%;

                  .fr_w50 {
                      float: right;
                      width: 50%;
                  }

                  .fr_w70 {
                      float: right;
                      width: 70%;
                  }

                  .fl_w50 {
                      float: left;
                      width: 50%;
                  }

                  .label {
                      font-weight: 100;
                      color: #222;
                      font-size: 15px;
                      /* margin: 0 10px 0 0; */
                      display: inline-block;
                  }
              `
            : css``;
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
        props.type === 'submit' &&
        css`
            width: 8%;
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

// 3-1) SelectBox: 분류 선택용 콤보박스 (select)
const SelectBox = styled.select`
    ${cssCustomInput};
    width: 50%;
    color: rgb(163, 163, 163);
`;

// 3-2) StyledOpt: select 태그의 option 태그
const StyledOpt = styled.option`
    color: ${(props) => props.noblack || 'black'};
`;

// 4) ResultSpan: 상품 - 색상, 사이즈 || 카테고리-소분류 정보 등 추가한 결과물들을 보여주는 Span
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

const ManageForProductTemplate = (props) => {
    const {
        ctrlpage,
        isUpdate,
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
        <ManageForProductWrapper>
            <MultiWrapper stype="pagename">
                <p id="pageType">
                    {ctrlpage === 'manageproduct'
                        ? '상품 등록'
                        : '카테고리 등록'}
                </p>
            </MultiWrapper>

            <form onSubmit={onSubmit} encType="multipart/form-data">
                <MultiWrapper stype="inputs">
                    <MultiWrapper stype="input_row">
                        <div className="fl_w50">
                            <div
                                className="label"
                                style={
                                    ctrlpage === 'manageproduct'
                                        ? { width: '10%' }
                                        : { width: '35%' }
                                }
                            >
                                {ctrlpage === 'manageproduct'
                                    ? '상품명'
                                    : '카테고리 Key (영문, 숫자)'}
                            </div>
                            <Input
                                type="text"
                                name={
                                    ctrlpage === 'manageproduct'
                                        ? 'name'
                                        : 'key'
                                }
                                onChange={onChange}
                                value={
                                    ctrlpage === 'manageproduct'
                                        ? productForm.name
                                        : categoryForm.key
                                }
                                addcss={
                                    ctrlpage === 'manageproduct'
                                        ? css`
                                              padding-bottom: 11px;
                                              width: 85%;
                                          `
                                        : css`
                                              padding-bottom: 11px;
                                              width: 60%;
                                          `
                                }
                            />
                        </div>

                        <div className="fr_w50">
                            <div
                                className="label"
                                style={
                                    ctrlpage === 'manageproduct'
                                        ? { width: '38%' }
                                        : { width: '23%' }
                                }
                            >
                                {ctrlpage === 'manageproduct'
                                    ? '상품 이미지 경로 (불러오기)'
                                    : '페이지에 보일 값'}
                            </div>
                            <Input
                                type={
                                    ctrlpage === 'manageproduct'
                                        ? 'file'
                                        : 'text'
                                }
                                accept={
                                    ctrlpage === 'manageproduct'
                                        ? 'image/*'
                                        : undefined
                                }
                                name={
                                    ctrlpage === 'manageproduct'
                                        ? 'image'
                                        : 'displayValue'
                                }
                                onChange={onChange}
                                value={
                                    ctrlpage === 'manageproduct'
                                        ? productForm.image
                                        : categoryForm.displayValue
                                }
                                addcss={
                                    ctrlpage === 'manageproduct'
                                        ? css`
                                              width: 57%;
                                              margin-left: 5%;
                                          `
                                        : css`
                                              width: 72%;
                                              margin-left: 5%;
                                          `
                                }
                            />
                        </div>
                    </MultiWrapper>

                    <ClearEx />

                    {ctrlpage === 'manageproduct' ? (
                        <MultiWrapper
                            stype="input_row"
                            style={{ marginTop: '15px' }}
                        >
                            <div className="fl_w50">
                                <div className="label" style={{ width: '25%' }}>
                                    상품 사이즈 등록
                                </div>
                                <Input
                                    type="text"
                                    name="size"
                                    onChange={onChange}
                                    value={productForm.size}
                                    addcss={css`
                                        width: 65%;
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
                            </div>
                            <div className="fr_w50">
                                <div className="label" style={{ width: '15%' }}>
                                    색상 설정
                                </div>
                                <Input
                                    type="color"
                                    name="color"
                                    onChange={onChange}
                                    value={productForm.color}
                                    addcss={css`
                                        width: 30px;
                                        height: 30px;
                                        position: relative;
                                        top: 5px;
                                    `}
                                />
                                <div
                                    className="label"
                                    style={{ width: '25%', marginLeft: '5%' }}
                                >
                                    표시될 이름 설정
                                </div>
                                <Input
                                    type="text"
                                    name="colorName"
                                    onChange={onChange}
                                    value={productForm.colorName}
                                    addcss={css`
                                        width: 44%;
                                    `}
                                />
                                <Input
                                    type="button" // button
                                    name="insertColors"
                                    value="+"
                                    onClick={onChange}
                                    addcss={css`
                                        width: 5%;
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
                            </div>
                        </MultiWrapper>
                    ) : (
                        <MultiWrapper
                            stype="input_row"
                            style={{ marginTop: '15px' }}
                        >
                            <div className="label" style={{ width: '15%' }}>
                                소분류 생성
                            </div>
                            <Input
                                type="text"
                                name="itemKey"
                                placeholder="소분류 Key (영문, 숫자)"
                                onChange={onChange}
                                value={categoryForm.itemKey}
                                addcss={css`
                                    width: 40%;
                                `}
                            />
                            <Input
                                type="text"
                                name="itemValue"
                                placeholder="소분류 value"
                                onChange={onChange}
                                value={categoryForm.itemValue}
                                addcss={css`
                                    width: 40%;
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
                        </MultiWrapper>
                    )}

                    <ClearEx />

                    {ctrlpage === 'manageproduct' && (
                        <>
                            <MultiWrapper
                                stype="input_row"
                                style={{ marginTop: '15px' }}
                            >
                                <div className="fl_w50">
                                    <div
                                        className="label"
                                        style={{ width: '10%' }}
                                    >
                                        가격
                                    </div>
                                    <Input
                                        type="number"
                                        name="price"
                                        min="1000"
                                        max="9999999"
                                        onChange={onChange}
                                        value={productForm.price}
                                        addcss={css`
                                            width: 80%;
                                        `}
                                    />
                                </div>
                                <div className="fr_w50">
                                    <div
                                        className="label"
                                        style={{ width: '15%' }}
                                    >
                                        세일 (%)
                                    </div>
                                    <Input
                                        type="number"
                                        name="sale"
                                        min="0"
                                        max="100"
                                        onChange={onChange}
                                        value={productForm.sale}
                                        addcss={css`
                                            width: 85%;
                                        `}
                                    />
                                </div>
                            </MultiWrapper>

                            <ClearEx />

                            <MultiWrapper
                                stype="input_row"
                                style={{ marginTop: '15px' }}
                            >
                                <div
                                    className="fl_w50"
                                    style={{ width: '45%' }}
                                >
                                    <TextArea
                                        name="description"
                                        rows="1"
                                        /* cols="50" */
                                        placeholder="부가설명"
                                        onChange={onChange}
                                        value={productForm.description}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div className="fr_w50">
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
                                                    <StyledOpt
                                                        key={v.id}
                                                        value={v.id}
                                                    >
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
                                                    <StyledOpt
                                                        key={v.id}
                                                        value={v.id}
                                                    >
                                                        {v.displayValue}
                                                    </StyledOpt>
                                                );
                                            })}
                                    </SelectBox>
                                </div>
                            </MultiWrapper>

                            <ClearEx />
                        </>
                    )}
                </MultiWrapper>

                {ctrlpage === 'manageproduct' && (
                    <>
                        <MultiWrapper stype="pagename">
                            <p id="pageType">
                                상품 상세 정보
                            </p>
                        </MultiWrapper>
                        <QuillContainer
                            reduxCustomform={{
                                formdata: productForm,
                                formname: 'productForm',                                
                            }}
                            isUpdate={isUpdate}
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
        </ManageForProductWrapper>
    );
};

export default ManageForProductTemplate;

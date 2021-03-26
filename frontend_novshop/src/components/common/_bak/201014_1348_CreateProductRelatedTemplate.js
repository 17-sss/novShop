import React from 'react';
import styled, { css } from 'styled-components';
import {
    CustomInput,
    CustomInputOptionBtn,
    CustomInputOptionResult,
    TransparentBtn,
} from '../../components/common/StyleUtilModels';
import { getSize } from '../../lib/utility/customFunc';

// CreateProductRelatedWrapper :: 전체 Wrapper
const CreateProductRelatedWrapper = styled.div`
    width: ${getSize(1.45)};
    margin: 0 auto;
`;

// InputWrapper :: 입력 폼 Wrapper
const InputWrapper = styled.div`
    width: ${getSize(3)};
    padding: ${(props) => props.padding || '4% 0 4%'};
    margin: 0 auto;

    ${(props) =>
        props.alignCenter &&
        css`
            text-align: center;
            align-items: center;
            justify-content: center;
        `};
`;

// CustomInputOptionResultWrapper :: 색상, 사이즈 등 추가한 결과물들을 보여주는 CustomInputOptionResult를 위한 Wrapper
const CustomInputOptionResultWrapper = styled.div`
    width: 100%;
    height: auto;
    word-break: break-all; /* 텍스트가 div영역을 나가버려서 추가. */
    margin-bottom: 10px;
`;

// SubmitBtn :: 전송버튼
const SubmitBtn = styled(TransparentBtn)`
    width: 70%;
    height: 30px;
    margin-top: 14px;
    color: #212121;

    background-color: #cccfd1;
    border-radius: 2px;
    box-shadow: 0.2px 0.2px 0.2px 0.2px lightgray;

    &:hover {
        background-color: #ededed;
    }
`;

const CreateProductRelatedTemplate = (props) => {
    const { ctrlpage, onChange, onDelete, category, product, onSubmit } = props;

    return (
        <CreateProductRelatedWrapper>
            <InputWrapper>
                <form onSubmit = {onSubmit}>
                    <input
                        name={ctrlpage === 'createproduct' ? 'name' : 'key'}
                        placeholder={
                            ctrlpage === 'createproduct'
                                ? '상품명'
                                : '카테고리 키 (영문)'
                        }
                        type="text"
                        onChange={onChange}
                        value={
                            ctrlpage === 'createproduct'
                                ? product.name
                                : category.key
                        }
                    />

                    <input
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
                        type="text"
                        onChange={onChange}
                        value={
                            ctrlpage === 'createproduct'
                                ? product.image
                                : category.displayValue
                        }
                    />

                    {ctrlpage === 'createproduct' ? (
                        <>
                            <CustomInput
                                name="size"
                                placeholder="상품 사이즈"
                                type="text"
                                onChange={onChange}
                                value={product.size}
                                addcss={css`
                                    width: 95%;
                                    margin-top: 16px;
                                `}
                            />
                            <CustomInputOptionBtn
                                name="insertSizes"
                                onClick={onChange}
                                addcss={css`
                                    width: 5%;
                                `}
                            />
                            <CustomInputOptionResultWrapper>
                                {product.sizes &&
                                    product.sizes.map((v, i) => {
                                        return (
                                            <CustomInputOptionResult
                                                key={i}
                                                onClick={onDelete}
                                            >
                                                {v}
                                            </CustomInputOptionResult>
                                        );
                                    })}
                            </CustomInputOptionResultWrapper>
                        </>
                    ) : (
                        <>
                            <CustomInput
                                name="itemKey"
                                placeholder="소분류 key"
                                type="text"
                                onChange={onChange}
                                value={category.itemKey}
                                addcss={css`
                                    width: 47.5%;
                                    margin-top: 16px;
                                `}
                            />
                            <CustomInput
                                name="itemValue"
                                placeholder="소분류 value"
                                type="text"
                                onChange={onChange}
                                value={category.itemValue}
                                addcss={css`
                                    width: 47.5%;
                                    margin-top: 16px;
                                `}
                            />
                            <CustomInputOptionBtn
                                name="insertItems"
                                onClick={onChange}
                                addcss={css`
                                    width: 5%;
                                `}
                            />
                            <CustomInputOptionResultWrapper>
                                <CustomInputOptionResult>
                                    {category.items}
                                </CustomInputOptionResult>
                            </CustomInputOptionResultWrapper>
                        </>
                    )}

                    {ctrlpage === 'createproduct' && (
                        <>
                            <>
                                <CustomInput
                                    name="color"
                                    placeholder="색상정보 (배열)"
                                    type="color"
                                    onChange={onChange}
                                    value={product.color}
                                    addcss={css`
                                        width: 95%;
                                    `}
                                />
                                <CustomInputOptionBtn
                                    name="insertColors"
                                    onClick={onChange}
                                    addcss={css`
                                        position: relative;
                                        top: -10px;
                                        width: 5%;
                                    `}
                                />
                                <CustomInputOptionResultWrapper>
                                    {product.colors &&
                                        product.colors.map((v, i) => {
                                            return (
                                                <CustomInputOptionResult
                                                    color={v}
                                                    key={i}
                                                    onClick={onDelete}
                                                >
                                                    {v}
                                                </CustomInputOptionResult>
                                            );
                                        })}
                                </CustomInputOptionResultWrapper>
                            </>
                            
                            <CustomInput
                                name="price"
                                placeholder="가격"
                                type="number"
                                min="1000"
                                max="9999999"
                                onChange={onChange}
                                value={product.price}
                            />
                            <CustomInput
                                name="sale"
                                placeholder="세일가"
                                type="number"
                                min="0"
                                max="9999999"
                                onChange={onChange}
                                value={product.sale}
                            />
                            {/*
                            <CustomInput
                                // textarea로 변경해야함
                                name="description"
                                placeholder="부가설명"
                                type="text"
                                onChange={onChange}
                                value={product.description}
                            />                        
                            <CustomInput
                                name="categorySub"
                                placeholder="카테고리 소분류 (id)"
                                type="콤보박스사용"
                                onChange={onChange}
                                value={product.categorySub}
                            />
                            <CustomInput
                                name="categoryId"
                                placeholder="카테고리 대분류 (id)"
                                type="콤보박스사용"
                                onChange={onChange}
                                value={product.categoryId}
                            />
                            */}
                        </>
                    )}
                    <InputWrapper alignCenter padding={'0px'}>
                        <SubmitBtn type="submit">전송</SubmitBtn>
                    </InputWrapper>
                </form>
            </InputWrapper>
        </CreateProductRelatedWrapper>
    );
};

export default CreateProductRelatedTemplate;

//*-------------------------------
// NOT USE
//*-------------------------------

import React from 'react';
import styled, { css } from 'styled-components';

import CreateInputContainer from '../../custom/containers/CreateInputContainer';
import { getSize } from '../../../lib/utility/customFunc';

/* 그냥 메모.
    #666 === rgb(102, 102, 102); 
    
*/

// *************** CSS ***************
const CSSInput = css`
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

const CSSCreateInputBtn = css`
    margin-top: 1%;
    padding: 0.5rem;
    font-size: 16px;
    color: white;
    background-color: rgb(170, 170, 170);
    border-radius: 1px;

    &:hover {
        background-color: rgb(150, 150, 150);
    }
`;

const CSSResultDiv = css`
    margin-top: 1%;
    padding: 0.5rem 0;
    font-size: 16px;
`;

// *************** Styled ***************
const CreateItemWrapper = styled.div`
    width: ${getSize(1.45)};
    margin: 0 auto;
`;

const InputForm = styled.form`
    width: ${getSize(3)};
    padding: 4% 0 4%;
    margin: 0 auto;

    /*
    padding-top: ${getSize(10)};
    padding-bottom: ${getSize(7)};
    text-align: center;
    align-items: center;
    justify-content: center;
    */
`;

const Input = styled.input`
    ${CSSInput}
`;

const AdminCreateItemTemplate = ({ ctrlpage }) => {
    return (
        <>
            <CreateItemWrapper>
                <InputForm>
                    <Input
                        name={ctrlpage === 'createproduct' ? 'name' : 'key'}
                        placeholder={
                            ctrlpage === 'createproduct'
                                ? '상품명'
                                : '카테고리 키 (영문)'
                        }
                        type="text"
                        // onChange={onChange}
                        // value={form.userpwdConfirm}
                    />
                    <br />
                    <Input
                        name={
                            ctrlpage === 'createproduct'
                                ? 'image'
                                : 'displayvalue'
                        }
                        placeholder={
                            ctrlpage === 'createproduct'
                                ? '상품 이미지 경로 (불러오기)'
                                : '페이지에 보일 값'
                        }
                        type={ctrlpage === 'createproduct' ? '미정의' : 'text'}
                    />
                    <br />

                    {/* 공사중 ============================ START */}
                    
                    
                    {ctrlpage === 'createproduct' ?
                        <CreateInputContainer                        
                            inputopt={{
                                css: CSSInput,
                                name: 'sizes',
                                placeholder: '상품 사이즈',
                                width: '95%',
                            }}
                            btnopt={{ css: CSSCreateInputBtn, width: '5%' }}
                            resultopt={{ css: CSSResultDiv, width: '33%' }}
                        />   
                        :
                        <CreateInputContainer
                            inputopt={{
                                css: CSSInput,
                                defineInput: [    // items
                                    { name: 'itemKey', placeholder: '소분류 key', width: '47.5%' },
                                    { name: 'itemValue', placeholder: '소분류 value', width: '47.5%' }
                                ]                            
                            }}
                            btnopt={{ css: CSSCreateInputBtn, width: '5%' }}
                            resultopt={{ css: CSSResultDiv, width: '33%' }}
                        />   
                    }
                    
                    {/* 공사중 ============================  END */}

                    {/*                     
                    <Input
                        name={ctrlpage === 'createproduct' ? 'sizes' : 'items'}
                        placeholder={
                            ctrlpage === 'createproduct'
                                ? '사이즈 정보 추가'
                                : '소분류 (3 * 배열)'
                        }
                        type={
                            ctrlpage === 'createproduct' ? '미정의' : '미정의'
                        }
                    />                     
                    */}

                    {ctrlpage === 'createproduct' && (
                        <>
                            <br />
                            <Input
                                name="colors"
                                placeholder="색상정보 (배열)"
                                type="미정의"
                            />
                            <br />
                            <Input
                                name="price"
                                placeholder="가격"
                                type="text"
                            />
                            <br />
                            <Input
                                name="sale"
                                placeholder="세일가"
                                type="text"
                            />
                            <br />
                            <Input
                                // textarea로 변경해야함
                                name="description"
                                placeholder="부가설명"
                                type="text"
                            />
                            <br />
                            <Input
                                name="categorySub"
                                placeholder="카테고리 소분류 (id)"
                                type="콤보박스사용"
                            />
                            <br />
                            <Input
                                name="categoryId"
                                placeholder="카테고리 대분류 (id)"
                                type="콤보박스사용"
                            />
                        </>
                    )}
                </InputForm>
            </CreateItemWrapper>
        </>
    );
};

export default AdminCreateItemTemplate;

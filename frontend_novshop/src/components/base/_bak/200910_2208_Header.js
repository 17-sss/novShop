import React from 'react';
import styled, {css} from 'styled-components';
import {CustomLink, ClearEx, cssDropdown, DropdownContent, ModalBtn} from '../common/StyleUtilModels';
import {getSize} from '../../lib/utility/customFunc';
import data from '../../lib/json/categoryList.json';

// ****************************************************************************************
// Font Awesome 관련 :: https://fontawesome.com/how-to-use/on-the-web/using-with/react
// ****************************************************************************************
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingBasket, faBars } from '@fortawesome/free-solid-svg-icons';       // fas
import { faUser } from '@fortawesome/free-regular-svg-icons';       // far
// import { faUser } from '@fortawesome/free-brands-svg-icons';     // fab
// ----------------------------------------------------------------------------------------/

// 헤더 :: [공통] START ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
// ========================================================================================
// ************* 헤더용 Wrapper *************
// ========================================================================================
const HeadWrapper = styled.div`
    width: ${getSize(1.45)};    
    position: relative;
    margin: 0 auto;
    /* background-color: #ccc; */
    
    /* type에 따라 height 조정 (Header & Category) */
    ${props => props.type === "Category" ? 
        css`    /* Category */ 
            height: 40px;
            border-bottom: 1px solid #f6f6f6;        
        `     
        : 
        css`    /* Header */ 
            height: 140px;
        ` 
    }
`;
// ----------------------------------------------------------------------------------------/ 


// ========================================================================================
// ************* 헤더용 구분선 : hr *************
// ========================================================================================
const HeadHr = styled.hr`
    width: ${getSize(1)};    
    position: relative; /* 굳이 없어도 되는거같지만.. 그래도? */
    margin: 0 auto;
`;
// ----------------------------------------------------------------------------------------/ 


// ========================================================================================
// ************* 헤더 Icons & 카테고리 : li *************
// ========================================================================================
const HeadLi = styled.li`
    ${props => props.isdropdown && cssDropdown};
    ${props => props.posrelative && css` position: relative; `};    
`;
// ----------------------------------------------------------------------------------------/ 


// ========================================================================================
// ************* 헤더 Icons & 카테고리 : ul *************
// ========================================================================================
const HeadUL = styled.ul`
    /* type에 따른 Style (Header & Category) */
    ${(props) => props.type === "Category" ?
        css`    /* Category */
            height: 40px;
            line-height: 40px;
            padding-left: 33px;

            ${HeadLi} {
                /* list-style-type: none; */
                float: left;
                padding: 0 15px;                
            }
        `
        :
        css`    /* Header */
            ${HeadLi} {
                float: left;
                margin-right: 12px;
                
                &:last-child {
                    margin-right: 0px;
                }
            }
        `
    }    
`;
// ----------------------------------------------------------------------------------------/ 
// 헤더 :: [공통] END ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒



// 헤더 :: [아이콘, 로고] START ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
// ========================================================================================
// ************* 헤더 로고 : div *************
// ========================================================================================
const TopLogo = styled.div`
    text-align: center;
    margin: 0 auto;    
    display: table;
    line-height: 140px;
`;

const TopLogoLink = styled(CustomLink)`        
    vertical-align: middle;
    /* display: table-cell; */
`;  
// ----------------------------------------------------------------------------------------/


// ========================================================================================
// ************* 헤더 유저 / 전체 카테고리 (Icon) : div  *************
// ========================================================================================
const HeadIconSection = styled.div`
    position: absolute;

    ${(props) => {
        if (props.loc === "right")        
            return css`{right: 5px;}`
        else if (props.loc === "left")    
            return css`{left: 5px;}`
        else                            
            return css`{right: 5px;}`
    }}

    top: 70px;
`;
// ----------------------------------------------------------------------------------------/    
// 헤더 :: [아이콘, 로고] END ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒


// ○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○

// createCategory, 카테고리 생성용 함수
function createCategory(key, value = '', items) {
    let valueTmp = value;
    if ( !value && key ) {
        valueTmp = key.toUpperCase();
    }
    return {
        // es6에서 KEY와 value가 같으면 하나로 적어줘도 됨.
        key, 
        value: valueTmp, 
        items,
    };
}
// ----------------------------------------------------------------------------------------/  


const Header = () => {
    //console.log(data[0].id);
// 카테고리 리스트 Item 생성 (임시) START
    const categoryList = [];
    categoryList.push(
        createCategory('quick', '퀵&당일발송'),
        createCategory('best'),
        createCategory('new', 'NEW 5%'),
        createCategory('selfproduced', '자체제작'),
        createCategory('basic'),
        createCategory('outer', '', [ 
            {item: {link: '1', name: 'ONE'}}, 
            {item: {link: '2', name: 'TWO'}}  
        ]),
        createCategory('knit', '', [ 
            {item: {link: '1', name: 'ONE'}}, 
            {item: {link: '2', name: 'TWO'}}  
        ]),
        createCategory('tshirt', 'T-SHIRT', [ 
            {item: {link: '1', name: 'ONE'}}, 
            {item: {link: '2', name: 'TWO'}}  
        ]),
        createCategory('shirt', '', [ 
            {item: {link: '1', name: 'ONE'}}, 
            {item: {link: '2', name: 'TWO'}}  
        ]),
        createCategory('pants', '', [ 
            {item: {link: '1', name: 'ONE'}}, 
            {item: {link: '2', name: 'TWO'}}  
        ]),
        createCategory('shoes', '', [ 
            {item: {link: '1', name: 'ONE'}}, 
            {item: {link: '2', name: 'TWO'}}  
        ]),
        createCategory('accessory', '', [ 
            {item: {link: '1', name: 'ONE'}}, 
            {item: {link: '2', name: 'TWO'}}  
        ]),
        createCategory('sale', 'SALE 80%', [ 
            {item: {link: '1', name: 'ONE'}}, 
            {item: {link: '2', name: 'TWO'}}  
        ]),
        createCategory('oneplus', '1+1', [ 
            {item: {link: '1', name: 'ONE'}}, 
            {item: {link: '2', name: 'TWO'}}  
        ]),
        createCategory('big', 'BIG X BIG', [ 
            {item: {link: '1', name: 'ONE'}}, 
            {item: {link: '2', name: 'TWO'}}  
        ]),
        createCategory('community', ''),
    );        
// 카테고리 리스트 Item 생성 (임시) END

// 임시용 변수들 START
    const userid = "testid";
// 임시용 변수들 END

    return (
        <>
            {/* *** 헤더 [아이콘, 로고] START *** */}

            <HeadWrapper>
                {/* 헤더 로고 START */}
                <TopLogo>
                    <TopLogoLink 
                        to = '/'                         
                        margin="0"
                    >
                        <img 
                            src="/images/logo_Trans.png"
                            alt="logo"
                        />
                    </TopLogoLink>
                </TopLogo>
                {/* 헤더 로고 END */}


                {/* 헤더 전체 카테고리 (Icon) 관련 START */}
                <HeadIconSection
                    loc = "left"
                >
                    <ul>
                        <li>                         
                            <FontAwesomeIcon icon = {faBars} size = 'lg'/>    
                        </li>
                    </ul>
                </HeadIconSection>
                {/* 헤더 전체 카테고리 (Icon) 관련 END */}
                

                {/* 헤더 유저 (Icon) 관련 START */}
                <HeadIconSection>
                    <HeadUL>
                        <HeadLi >                                                     
                            <CustomLink to = "/login">                            
                                <FontAwesomeIcon icon = {faUser} size = 'lg'/>        
                            </CustomLink> 
                        </HeadLi>

                        <HeadLi posrelative>
                            <CustomLink to = {"/shoppingbasket/@" + userid}>
                                <FontAwesomeIcon icon = {faShoppingBasket} size = 'lg' />                            
                            </CustomLink>
                        </HeadLi>

                        <HeadLi>             
                            <ModalBtn mode="search">
                                <FontAwesomeIcon icon = {faSearch} size = 'lg' />                                            
                            </ModalBtn>               
                        </HeadLi>
                    </HeadUL>
                </HeadIconSection>                            
                {/* 헤더 유저 (Icon) 관련 END */}
            </HeadWrapper>                        
            {/* *** 헤더 [아이콘, 로고] END *** */}

            <ClearEx />     {/* float 써서 clear: both 함 */}    
            <HeadHr/>

            {/* *** 헤더 [카테고리] START *** */}
            <HeadWrapper type = "Category">
                <HeadUL  type = "Category">                                    
                    {categoryList.map( (v, i) => {
                        const parentLink = "/shopping/@" + v.key; 
                        return (
                            <HeadLi 
                                key = {v.key}
                                isdropdown = {v.items && true}  // 여기서 작동해야함. 부모인 StyledHeadUL에서 작동하면안대..
                            >                            
                                <CustomLink
                                    to = {parentLink}
                                    margin = "0"                                                                     
                                >
                                    {v.value}
                                </CustomLink>                                
                                {
                                    (v.items) &&
                                        <DropdownContent>
                                            {v.items.map( (vTmp, i) => {                                                
                                                const {link, name} = vTmp.item; 
                                                const contentKey = v.key + '_' + name;
                                                const childLink = parentLink + "?bid=" + link

                                                return (
                                                    <CustomLink 
                                                        to = {childLink}                                                      
                                                        key = {contentKey}
                                                        margin = "0"
                                                    >                                                           
                                                        {name}
                                                    </CustomLink>
                                                )
                                            })}
                                        </DropdownContent>    
                                }

                            </HeadLi>
                        );                                                
                    })}                                                     
                </HeadUL>            
            </HeadWrapper>    
            {/* *** 헤더 [카테고리] END *** */}
            
            <ClearEx />
        </>
    );
};

export default Header;
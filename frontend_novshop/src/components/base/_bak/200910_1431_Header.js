import React from 'react';
import styled, {css} from 'styled-components';
import {CustomLink, ClearEx, cssDropdown, DropdownContent} from '../common/StyleUtilModels';
import {getSize} from '../../lib/utility/customFunc'

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
function createCategory(key, value = '', items = []) {
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
    const categoryList1 = [];
    categoryList1.push(
        createCategory('quick', '퀵&당일발송'),
        createCategory('best'),
        createCategory('new', 'NEW 5%'),
        createCategory('selfproduced', '자체제작'),
        createCategory('basic'),
        createCategory('outer', '', []),
        createCategory('knit', '', []),
        createCategory('tshirt', 'T-SHIRT', []),
        createCategory('shirt', '', []),
        createCategory('pants', '', []),
        createCategory('shoes', '', []),
        createCategory('accessory', '', []),
        createCategory('sale', 'SALE 80%', []),
        createCategory('oneplus', '1+1', []),
        createCategory('big', 'BIG X BIG', []),
        createCategory('community', '', []),
    );
    console.log(categoryList1);

// 카테고리 리스트 Item 생성 (임시) START
    const keys = [
        'quick', 'best', 'new', 'selfproduced', 'basic',
        'outer', 'knit', 'tshirt', 'shirt', 'pants', 'shoes',
        'accessory', 'sale', 'oneplus', 'big', 'community'
    ];
    const values =  [
        '퀵&당일발송', 'BEST', 'NEW 5%', '자체제작' ,'BASIC', 
        'OUTER', 'KNIT', 'T-SHIRT', 'SHIRT', 'PANTS', 'SHOES', 
        'ACCESSORY', 'SALE 80%', '1+1', 'BIG X BIG', 'COMMUNITY'
    ];

    const categoryList = [];
    keys.map( (item, i) => categoryList.push({key: item, value: values[i],}));
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
                            <FontAwesomeIcon icon = {faSearch} size = 'lg' />                
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
                    {categoryList.map( (item, i) => {
                        return (
                            <HeadLi 
                                key = {item.key}
                                isdropdown = {(i > 4)}  // 여기서 작동해야함. 부모인 StyledHeadUL에서 작동하면안대..
                            >                            
                                <CustomLink
                                    to = {"/shopping/@" + item.key}
                                    margin = "0"                                                                     
                                >
                                    {item.value}
                                </CustomLink>                                
                                {
                                    (i > 4) &&
                                        <DropdownContent>
                                            <CustomLink to="/#123">ONE</CustomLink>    
                                            <CustomLink to="/#234">TWO</CustomLink>
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
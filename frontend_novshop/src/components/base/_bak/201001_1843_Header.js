import React from 'react';
import styled, {css} from 'styled-components';
import {CustomLink, ClearEx, cssDropdown, DropdownContent, ModalBtn, StyledHr, BorderBotLine, TransparentBtn } from '../common/StyleUtilModels';
import {getSize} from '../../lib/utility/customFunc';
import categoryData from '../../lib/data/categoryList.json';

// ****************************************************************************************
// Font Awesome 관련 :: https://fontawesome.com/how-to-use/on-the-web/using-with/react
// ****************************************************************************************
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingBasket, faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';       // fas
import { faUser } from '@fortawesome/free-regular-svg-icons';       // far

// import { faUser } from '@fortawesome/free-brands-svg-icons';     // fab
// ----------------------------------------------------------------------------------------/


// 각종 함수 or 변수 START ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// [F] createCategory, 카테고리 객체 생성용 함수
const createCategory = ({...data}) => {
    const { id, key, value, items } = data;
    let valueTmp = value;
    if (!value && key) {
        valueTmp = key.toUpperCase();
    }
    return {
        id,
        key,
        value: valueTmp,
        items: items,
    };
};
// ----------------------------------------------------------------------------------------/  
// 각종 함수 or 변수 END ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■



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
        `     
        : 
        css`    /* Header */ 
            height: 140px;
        ` 
    }
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

const Header = (props) => {    
    const {onLogout, userData} = props;      
    const {user} = userData ? userData : '';
    

// 임시용 변수들 START
    // [1] 카테고리 리스트 Item 생성 (임시) START
    // 200911 MEMO, 카테고리 목록(categoryData)은 json으로 만들어 놓음. 나중에 DB만들때 변경하기
    const categoryList = [];
    categoryData.map((v, i) => {        
        return categoryList.push(createCategory({...v}));
    });
    
    // console.log(categoryList[15].items[0].value);
    // [1] 카테고리 리스트 Item 생성 (임시) END
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


                {/* (사용안함) 헤더 전체 카테고리 (Icon) 관련 START */}
                <HeadIconSection
                    loc = "left"
                    style={{ display: "none" }}
                >
                    <ul>
                        <li>                         
                            <FontAwesomeIcon icon = {faBars} size = 'lg'/>    
                        </li>
                    </ul>
                </HeadIconSection>
                {/* (사용안함) 헤더 전체 카테고리 (Icon) 관련 END */}
                

                {/* 헤더 유저 (Icon) 관련 START */}
                <HeadIconSection>
                    <HeadUL>
                        <HeadLi >                                                     
                            <CustomLink to = {user ? ("/member/@"+user.userid) : "/auth/login"}>                            
                                <FontAwesomeIcon icon = {faUser} size = 'lg'/>        
                            </CustomLink> 
                        </HeadLi>
                        
                        {user && 
                        <>
                            <HeadLi posrelative>                                
                                <CustomLink to = {user ? ("/shoppingbasket/@" + user.userid) : "/" }>
                                    <FontAwesomeIcon icon = {faShoppingBasket} size = 'lg' />                            
                                </CustomLink>
                            </HeadLi>
                            <HeadLi posrelative>
                                <TransparentBtn 
                                    onClick = {onLogout} 
                                    hovercolor= "#007bff">
                                    <FontAwesomeIcon icon = {faSignOutAlt} size = 'lg' />
                                </TransparentBtn>
                            </HeadLi>
                        </>
                        }

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
            <StyledHr/>

            {/* *** 헤더 [카테고리] START *** */}
            <HeadWrapper type = "Category">
                <HeadUL  type = "Category">                                    
                    {categoryList.map( (v, i) => {  
                        const childItems = v.items;
                        // const childItems = Object.values(v.items);
                        const isDropdown = (childItems.length <= 0 ? false : true);                                              
                        const parentLink = "/shopping/" + v.key; 
                                                                    
                        return (
                            <HeadLi 
                                key = {v.id}
                                isdropdown = {isDropdown}  // 여기서 작동해야함. 부모인 StyledHeadUL에서 작동하면안대..
                            >                            
                                <CustomLink
                                    to = {parentLink}
                                    margin = "0"                                                                     
                                >
                                    {v.value}                                    
                                </CustomLink>                                
                                {                                    
                                    isDropdown &&
                                        <DropdownContent>
                                            {childItems.map( (vItem, i) => {                                                
                                                const {id, value} = vItem;                                                 
                                                const childLink = parentLink + "/" + id;

                                                return (
                                                    <CustomLink 
                                                        to = {childLink}                                                      
                                                        key = {id}
                                                        margin = "0"
                                                    >                                                           
                                                        {value}
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
            <BorderBotLine/>
        </>
    );
};

export default Header;
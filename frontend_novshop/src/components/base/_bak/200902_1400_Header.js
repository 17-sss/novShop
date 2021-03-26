import React from 'react';
import styled, {css} from 'styled-components';
import {MarginBlock, StyledCustomLink, StyledTransparentBtn} from '../../common/StyleUtilModels';
// https://fontawesome.com/how-to-use/on-the-web/using-with/react
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'


// ***************************************************************************************************************
// ***************************************************************************************************************

// *** HeaderWrapper, 헤더 Wrapper ***
const HeaderWrapper = styled.div`
    position: ${(props) => props.position};
    background-color: ${(props) => props.backgroundColor || "white"};  
    
    ${(props) => {
            if (props.nonresponsive) {
                return css`
                    width: 1920px;
                    max-width: none !important;
                `
            } 
            else {
                return css`
                    width: ${(props) => props.width === undefined ? "100%" : props.width};             
                `
            }
        }
    }
    box-shadow: ${(props) => props.boxShadow || "rgba(0, 0, 0, 0.08) 0px 2px 4px"}; 
    
`;

// *** HeaderBlock, 헤더 Block ***
const HeaderBlock = styled.div`
    position: ${(props) => props.position && 'relative'};
    height: 120px;
`;

// *** HearderUl / Li ▶ 헤더 카테고리용 ui, li ***  [START]
/* 
    오른쪽으로 순서대로 정렬하기 위해, 
    ul 개체에서 float right 해준 후, 
    li 태그에서 float left  해주면 
    오른쪽으로 순서대로 정렬됨 
*/
const HeaderUl = styled.ul` 
    padding: ${props => props.padding === undefined ? "0.5rem 0 0 0" : props.padding};
    margin: ${props => props.margin && props.margin};
    float: ${props => props.float || 'right'};
    position: ${props => props.posRelative && 'relative'};
`;

const HeaderLi = styled.li`
    margin-bottom: 0.5rem;
    float: ${props => props.float || 'left'};   

    ${props => props.vertical && // vertical 속성은 | 와 같은 수직선 의미
        css`
            padding: 0 10px;
            &::after {
                content: '';
                display: inline-block;
                position: absolute;
                /* left: 0; */
                top: 10px;
                width: 1px;
                height: 15px;
                background-color: #ddd;
                vertical-align: top;
            }
            
        `    
    };
`;
// *** HearderUl / Li ▶ 헤더 카테고리용 ui, li ***  [END]

// *** HeaderLogoFont, 헤더 로고 : 폰트 ***    (사용안함)
/*
const HeaderLogoFont = styled.h1` 
    position: ${props => props.posAbsolute && 'absolute'};
    float: left;
    font-family: "Bauhaus 93";
    font-size: ${props => props.fontSize === undefined ? "23.5pt" : props.fontSize}; 
`;
*/

// *** HeaderLogoImage, 헤더 로고 : 이미지 ***
const HeaderLogoImage = styled.div`
    /* 
        ** 이미지 수정 시: 
            원본 - onlinelogomaker.com/logomaker/?project=66437368  
            투명배경 - Pixir 사용
    */
    background-image: url("/images/logo_Trans.png");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    width: 200px;
    height: 47px;

    position: absolute;
    top: 25px;

    cursor: pointer;
`;

// *** HeaderHr, 헤더 구분선 ***
const HeaderHr = styled.hr`
    margin: 0;
    border-top: 1px solid rgb(255, 240, 240);
`;

// *** SearchInput, 검색 창 ****
const SearchInput = styled.input`
    font-size: 10pt;
    border: 1.4px solid rgb(152, 234, 240);
    padding: 5% 0%;
    outline: none;
    width: 85%;    
/*
    -webkit-border-radius: 20px;
    -moz-border-radius: 20px;
    border-radius: 20px;
*/

    &:focus {        
        border: 1.4px solid rgb(142, 211, 216);
    }
`;

// *** SearchBtn, 검색 버튼 ****
const SearchBtn = styled(StyledTransparentBtn)`
    vertical-align: middle;
    width: 10%;
    margin-left: 3%;
`;

// *** SearchIcon, 검색 아이콘 ****
const SearchIcon = styled(FontAwesomeIcon)`
    color: rgb(152, 234, 240);
    font-size: 13pt;
    &:hover {
        color: rgb(142, 211, 216); 
    }
`;



// *** EmptyBlock ***
// HeaderBlock position이 fixed일 경우 사용하는 (height 조절용) 컴포넌트
const EmptyBlock = styled.div`
    ${props => 
        props.off ||
        css`
            height: 6.6rem;
            background-color: rgb(255, 253, 255);
        `
    }
`;

// ***************************************************************************************************************
// ***************************************************************************************************************
const Header = (props) => {
    const categorySample = ['음식', '의류', '가구'];
    const authSample = ['로그인', '회원가입', '알림', '주문/배송', '고객센터', '장바구니'];

    return (
        <>
            <HeaderWrapper 
                // id  = {props.id}
                nonresponsive = {props.nonresponsive}
            >    

                <MarginBlock>  
                    <HeaderBlock>
                        {/*                         
                            // 헤더 로고 : 폰트형 (사용안함)
                        <HeaderLogoFont posAbsolute>
                            <CustomLink 
                                to = '/'
                                margin = '0'   
                                hoveroff = 'true'
                            >
                                nov Shop
                            </CustomLink>
                        </HeaderLogoFont>     
                        */}
                        <HeaderLogoImage onClick = {() => global.location.href = '/'}/>

                        <HeaderUl posRelative>        
                            {authSample.map((item, i) => {
                                if (i === 2) { 
                                    return (<HeaderLi vertical key=''/>);
                                }

                                return (
                                    <HeaderLi key = {i}>
                                        <StyledCustomLink 
                                            to = {() => {
                                                return (
                                                    (i <= 1) ? 
                                                        (item === '로그인' ? '/login' : '/member/join') 
                                                        :
                                                        ('/#' + i)
                                                )                                         
                                            }}
                                            fontSize = "11pt"
                                        >
                                            {item}
                                        </StyledCustomLink>   
                                    </HeaderLi>
                                );
                            })}                                                        
                        </HeaderUl>  
                        <div style = {{clear: "right"}} />

                        <HeaderUl 
                            padding = '0' 
                            margin = '0.7rem 0 0 0' 
                            posRelative
                        >
                            <HeaderLi key = ''>     
                                <form onSubmit = {() => ''} method='get'>
                                    <SearchInput 
                                        placeholder='검색어를 입력해주세요.'
                                        name='search'
                                        type='text'
                                    />                                            
                                    <SearchBtn type='submit'>                                                                         
                                        <SearchIcon icon = {faSearch} /> 
                                    </SearchBtn>
                                    
                                </form>
                            </HeaderLi>
                            
                        </HeaderUl>
                        <div style = {{clear: "right"}} />
                    
                    </HeaderBlock>        
                </MarginBlock>
                
                <HeaderHr />

                <MarginBlock>
                    <HeaderUl
                        padding= "0.5% 0"
                    >        
                        {categorySample.map((item, i) => {
                            return (
                                <HeaderLi key = {i}>
                                    <StyledCustomLink 
                                        to = {'/shopping/@' + i}
                                        fontSize = "11pt"    
                                    >
                                        {item}
                                    </StyledCustomLink>   
                                </HeaderLi>
                            );
                        })}                               
                    </HeaderUl>           

                    {/* ▼ 이거있어야 위에서 사용한 float right 무효화가능 */}
                    <div style = {{clear: "right"}} />
                </MarginBlock>


            </HeaderWrapper>

            <EmptyBlock off />
        </>
    );
};

export default Header;
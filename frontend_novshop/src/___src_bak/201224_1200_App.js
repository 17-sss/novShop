import React from 'react';
import { Route, Switch } from 'react-router-dom';
// import { useGetWindowInnerEvent } from './lib/utility/customHooks';  사이즈에 따라 모바일앱처럼 변경하려했으나, 안함.

import HeaderContainer from './containers/base/HeaderContainer';
import Footer from './components/base/Footer';

import MainPage from './pages/MainPage';
import ShoppingPage from './pages/ShoppingPage';
import CommunityPage from './pages/CommunityPage';
import PurchasePage from "./pages/PurchasePage";
import WritePage from './pages/WritePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MemberPage from './pages/MemberPage';
import AdminPage from './pages/AdminPage';
import TestPage from './pages/TestPage';


const App = () => {    
    return (
        <>                  
            <HeaderContainer/>      
            <Switch>
                <Route component={MainPage} path="/" exact />
                {/* // Shopping (
                        1. path ▷ (대분류)카테고리 & (소분류)카테고리.종류
                        2. querystring ▷ 
                            + 라우트 내부 (ShoppingPage 파일)에서 query-string 미들웨어 사용하여 해결하기.
                */}
                {/* <Route component={ShoppingPage} path="/shopping/:category/:subcategory?" /> */}
                <Route component={ShoppingPage} path="/shopping" exact /> 
                {/* // Community (커뮤니티 (공지, CS)) */}
                <Route component={CommunityPage} path="/community/:page?" exact /> 
                {/* // Purchase (구매관련 (구매, 장바구니)) */}
                <Route component={PurchasePage} path="/purchase/:page" exact /> 
                {/* // Write (글쓰기(QA, 공지사항 등)) */}
                <Route component={WritePage} path="/write/:opt?" exact /> 

                {/* // Register (회원가입) */}
                <Route component={RegisterPage} path="/auth/register" />
                {/* // Login (로그인) */}
                <Route component={LoginPage} path="/auth/login" />
                {/* // Member (회원정보) */}
                <Route component={MemberPage} path="/member/@:username" />
                {/* // Admin (관리자 페이지) */}
                <Route component={AdminPage} path="/admin/:ctrlpage?" exact />

                {/* // Test (테스트 페이지) */}
                <Route component={TestPage} path="/test/:opt?" exact />
            </Switch>

            <Footer />
        </>
    );
};

export default App;

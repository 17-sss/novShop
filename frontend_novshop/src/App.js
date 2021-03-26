import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import CheckAuthRoute from './lib/utility/CheckAuthRoute';

import HeaderContainer from './containers/base/HeaderContainer';
import FooterContainer from './containers/base/FooterContainer';

import MainPage from './pages/MainPage';
import ErrorPage from "./containers/error/ErrorContainer";
import TestPage from './pages/TestPage';

import ShoppingPage from './pages/ShoppingPage';
import CommunityPage from './pages/CommunityPage';
import PurchasePage from "./pages/PurchasePage";
import WritePage from './pages/WritePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MemberPage from './pages/MemberPage';
import AdminPage from './pages/AdminPage';

const App = () => {    
    const { userData, loadingUser } = useSelector(({ user, loading }) => ({
        userData: user.user,
        loadingUser: loading['user/CHECK'],
    }));

    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!userData || !userData.data || typeof userData.data !== "object" ) return;
        setUser(userData.data);
    }, [userData]);   

    return (
        <>                  
            <HeaderContainer/>      
            <Switch>
                <Route component={MainPage} path="/" exact />     
                <Route component={ErrorPage} path="/error" exact />                
                <Route component={TestPage} path="/test/:opt?" exact />                
                {/* 
                    Shopping  
                    Community (커뮤니티 (공지, CS))    
                    Register (회원가입)
                    Login (로그인)
                */}
                <Route component={ShoppingPage} path="/shopping" exact /> 
                <Route component={CommunityPage} path="/community/:page?" exact /> 
                <Route component={RegisterPage} path="/auth/register" exact/>
                <Route component={LoginPage} path="/auth/login" exact/>
                
                {/* 회원 전용 */}
                {/* 
                    Purchase (구매관련 (구매, 장바구니)) 
                    Write (글쓰기(QA, 공지사항 등))
                    Member (회원정보)
                    Admin (관리자 페이지)
                */}
                {!loadingUser && (
                    <CheckAuthRoute
                        authenticated={user}
                        path="/purchase/:page"
                        render={(props) => <PurchasePage {...props} />}
                        exact
                    />
                )}
                {!loadingUser && (
                    <CheckAuthRoute
                        authenticated={user}
                        path="/write/:opt?"
                        render={(props) => <WritePage {...props} />}
                        exact
                    />
                )}
                {!loadingUser && (
                    <CheckAuthRoute
                        authenticated={user}
                        path="/member/@:userid/:opt?"
                        render={(props) => <MemberPage {...props} />}
                        exact
                    />
                )}
                {!loadingUser && (
                    <CheckAuthRoute
                        authenticated={user && user.authority > 0}
                        path="/admin/:ctrlpage?"
                        render={(props) => <AdminPage {...props} />}
                        exact
                    />
                )}   
                
                {/*  default */}
                <Route component={ErrorPage} /> 
            </Switch>

            <FooterContainer />
        </>
    );
};

export default App;

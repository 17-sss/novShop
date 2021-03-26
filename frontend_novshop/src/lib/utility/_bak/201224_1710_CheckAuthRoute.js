import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const CheckAuthRoute = ({    
    component: Component,
    render,
    isAdmin,
    redirectMain,
    ...parentProps
}) => {
    const { userData } = useSelector(({user}) => ({userData: user.user}));    
    const authenticated = useRef(null);
    const isLoadingOK = useRef(null);

    useEffect(() => {
        isLoadingOK.current = false;
        
        if (!userData || !userData.data || typeof userData.data !== "object") 
            return authenticated.current = false;        
        if (isAdmin) 
            authenticated.current = (userData.data.authority > 0);
        else 
            authenticated.current = true;
        
        isLoadingOK.current = true;
    }, [userData, isAdmin]);
    

    return isLoadingOK.current && (
        <Route
            {...parentProps}
            render={(props) =>
                authenticated.current ? (
                    render ? (
                        render(props)
                    ) : (
                        <Component {...props} />
                    )
                ) : (
                    <Redirect
                        to={redirectMain 
                            ? {
                                pathname: '/',
                                state: { from: props.location },
                            } : "/error"
                        }
                    />
                )
            }
        />
    );
};

export default CheckAuthRoute;

import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const CheckAuthRoute = ({
    authenticated,
    component: Component,
    render,
    redirectMain,
    ...parentProps
}) => {    
    return (
        <Route
            {...parentProps}
            render={(props) =>
                authenticated ? (
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

import React, { useReducer } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import styled, {css} from 'styled-components';

import { TransparentBtn } from '../../common/StyleUtilModels';
import {getSize} from '../../../lib/utility/customFunc';

function reducer(state, action) {
    switch (action.type) {
        case 'NEXT': {
            if (state.value === state.childrenCount - 1) {
                return {
                    ...state,
                    value: 0,
                };
            } else {
                return {
                    ...state,
                    value: state.value + 1,
                };
            }
        }
        case 'PREV': {
            if (state.value === 0) {
                const childCnt = state.childrenCount;
                return {
                    ...state,
                    value: (childCnt-1),
                };
            } else {
                return {
                    ...state,
                    value: state.value - 1,
                };
            }
        }
        case 'AUTO': {
            if (state.value < state.childrenCount - 1) {
                return {
                    ...state,
                    value: state.value + 1,
                };
            } else {
                return {
                    ...state,
                    value: 0,
                };
            }
        }

        default:
            return state;
    }
}

const AutoSwipeViews = autoPlay(SwipeableViews);

const StyledSwipeForm = styled.div`
    width: ${getSize(1)};          
    margin: 0 auto;
    position: relative;
    background-color: #f6f6f6;
`;

const StyledSwipeButton = styled(TransparentBtn)`
    position: absolute;
    margin-top: -40px;
    top: 50%;
    /* font-size: 6.4rem; */

    width: 40px;
    height: 77px;
    background-size: 40px 77px;
    opacity: 1 !important;

    ${ 
        (props) => {
            if (props.styleOption === 'PREV') {
                return css`
                    left: 8%;  
                    
                    background-image: url('/images/nav_arrow_left.png');
                `
            } else if (props.styleOption === 'NEXT') {
                return css`
                    right: 8%; 
                    background-image: url('/images/nav_arrow_right.png');
                `
            } else {
                return console.log('SwipeBtn Design error');
            }        
        }
    }

    color: rgb(235, 235, 235);

    &:hover {
        color: rgb(230, 230, 230);
    }
`;

const SwipeForm = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, {
        value: 0,
        childrenCount: React.Children.count(children),
    });

    return (
        <StyledSwipeForm>
            <AutoSwipeViews
                enableMouseEvents                
                index={state.value}
                onChangeIndex={() => dispatch({ type: 'AUTO' })}
                interval={4000}
            >                
                {children}                
            </AutoSwipeViews>

            <StyledSwipeButton 
                onClick={() => dispatch({ type: 'PREV' })}
                styleOption='PREV'
            />

            <StyledSwipeButton 
                onClick={() => dispatch({ type: 'NEXT' })}
                styleOption='NEXT'
            />
            
        </StyledSwipeForm>
    );
};

export default SwipeForm;

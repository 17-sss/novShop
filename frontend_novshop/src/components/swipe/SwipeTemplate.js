import React from 'react';
import SwipeForm from './frSwipe/SwipeForm';
import SwipeItem from './frSwipe/SwipeItem';

const SwipeTemplate = () => {
    return (
        <SwipeForm>
            <SwipeItem
                to="/Shopping/@SWIPE1"
                imageLink="/images/200810.jpg"                                               
            />                        
            <SwipeItem
                to="/Shopping/@SWIPE2"
                imageLink="/images/200730.jpg" 
            />            
            <SwipeItem
                to="/Shopping/@SWIPE3"
                imageLink="/images/200720.jpg"
                // imageLink="https://unsplash.it/477/205"
            />                          
        </SwipeForm>
    );
};

export default SwipeTemplate;

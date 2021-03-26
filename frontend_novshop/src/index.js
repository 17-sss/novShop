import React from 'react';
import ReactDOM from 'react-dom';
// react-bootstrap 모듈 사용시 필수
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';

// ** Redux 관련 START
import rootReducer, { rootSaga } from './modules';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux'; // 컴포넌트에서 스토어를 사용할 수 있도록 Provider 가져옴. 아래 랜더 시 provider로 감쌈
import { composeWithDevTools } from 'redux-devtools-extension';
// ** Redux 관련 END

import {tempSetUser, check} from './modules/user';


const sageMiddleware = createSagaMiddleware();
const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(sageMiddleware)),
);

// loadUser(localStorage 관련 설명, 메모: 200927 참고)
const loadUser = () => {
    try {
        const user = localStorage.getItem('user');

        if (!user) return;

        store.dispatch(tempSetUser(user));
        store.dispatch(check());
    } catch (error) {
        console.log('localStorage is not working');
    }
};

sageMiddleware.run(rootSaga);
loadUser();

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

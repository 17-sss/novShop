import { call, put } from "redux-saga/effects";
import { startLoading, finishLoading } from "../modules/loading";

// 액션 타입 정의하는 function
export const createRequestActionTypes = (type) => {
    const SUCCESS = `${type}_SUCCESS`;
    const FAILURE = `${type}_FAILURE`;
    return [type, SUCCESS, FAILURE];
};

// redux-saga를 통해 더 쉽게 API를 요청할 수 있게하는 function  (loading 리덕스 모듈과 같이 사용)
export const createRequestSaga = (type, request) => {
    const SUCCESS = `${type}_SUCCESS`;
    const FAILURE = `${type}_FAILURE`;

    return function* (action) {
        yield put(startLoading(type));  // 로딩 시작
        try {
            // ▼ res.status가 정상범위가 아니면 바로 catch 문으로 가는듯.            
            const response = yield call(request, action.payload);   

            yield put({
                type: SUCCESS,
                payload: response.data,
            })
        } catch (error) {
            const errResponse = error.response;

            yield put({
                type: FAILURE,
                payload: errResponse,
                // payload: error,
                error: true,                
            });
        }
        yield put(finishLoading(type)); // 로딩 끝
    }
}
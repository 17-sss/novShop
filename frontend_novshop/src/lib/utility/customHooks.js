import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

// **********************************************************************************
// *** useGetWindowInnerEvent : Window개체 innerWidth & innerHeight 가져오기 (Event 포함)
// **********************************************************************************
export const useGetWindowInnerEvent = () => {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        // 창 크기 정보를 호출하는 핸들러
        function handleResize() {
            // 창 너비/높이를 state 설정
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        // window 객체에 이벤트 리스너 추가 [1]
        window.addEventListener('resize', handleResize);

        // 초기 창 크기로 상태를 업데이트하도록 즉시 핸들러 호출 [2]
        handleResize();

        // window 객체에 등록된 이벤트 리스너 제거 [3]
        return () => window.removeEventListener('resize', handleResize);
    }, []); // 빈 배열을 사용하면 마운트시에만 효과가 실행됨

    return windowSize;
};

// **********************************************************************************
// *** useDetectHistoryLocation *** 페이지 이동 감지 (useHistory.location) :: 1
// ((사용안함, 스크롤바 여부에 따라 페이지 이동시에도 사이즈 갱신되게하려했었음) (MarginBlock에 사용하려함))
// **********************************************************************************
export const useDetectHistoryLocation = () => {
    const history = useHistory();

    useEffect(() => {
        return history.listen((location) => {
            // console.log(location);
            window.locationKey = location.key;
        });
    }, [history]);
};

// **********************************************************************************
// *** useDetectLocation *** 페이지 이동 감지 (useLocation) :: 2
// ((사용했었지만, 스크롤바 여부에 따라 페이지 이동시에도 사이즈 갱신되게하려하지만, 부자연스러운 움직임 포착. 비활성)
// **********************************************************************************
export const useDetectLocation = () => {
    const [detectLocation, setDetectLocation] = useState({
        pathname: undefined,
        key: undefined,
    });

    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });

    const location = useLocation();

    useEffect(() => {
        const { pathname, key } = location;

        function executeAction () {
            setDetectLocation({
                pathname: pathname,
                key: key,
            });

            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });

            window.customLocation = {
                ...detectLocation,
                ...windowSize,
            }
        };        
        
        executeAction();        
    }, 
    // eslint-disable-next-line
    [location /*location, detectLocation, windowSize*/]);
};


// ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
/* 
    꼭 아래 2개의 Custom Hook이 화면 Resize 될때마다 자동으로 업뎃되는 줄 알았더니..
    App.js에서 사용하는 useWindowSize Hook 때문임. 
    useWindowSize에서 이벤트 리스너 ('resize') 다루기 때문.
    App.js는 알다시피 최상위 느낌

    ---> Hook에 대한 개념정리 다시하길.
*/
// ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★

// **********************************************************************************
// *** useCalcMargin *** Margin 값 계산 (Percent형식을 px로 설정하기 위함)
// **********************************************************************************
/* 
    1. React - exhaustive-deps warning 해결법:
        https://dawan0111.github.io/blog/react/react--exhaustive-deps/
    2. useEffect(), useMemo(), useCallback() 정리
        https://likejirak.tistory.com/48
*/
export const useCalcMargin = (AmarginPercent) => {
    const [calcMargin, setCalcMargin] = useState(0);
    const winInnerWidth = window.innerWidth;

    useEffect(() => {
        let marginPer = 0;

        if (AmarginPercent <= 0) marginPer = 0;
        else if (AmarginPercent < 100) marginPer = AmarginPercent * 0.01;
        else marginPer = 0;

        // Margin 계산
        setCalcMargin(winInnerWidth * marginPer);
        
    }, [AmarginPercent, winInnerWidth]);

    return calcMargin;
};

// **********************************************************************************
// *** useCalcVertScrollWidth *** 수직 ScrollBar Width 값 계산 (사용안함)
// **********************************************************************************
export const useCalcVertScrollWidth = () => {
    const [verticalScrollWidth, setVerticalScrollWidth] = useState(0);
    // const winInnerWidth = window.innerWidth;
    const winCustomKey = window.customLocation.key;

    useEffect(() => {
        setVerticalScrollWidth(
            window.innerWidth - document.documentElement.clientWidth,
        );
        
    }, [winCustomKey]);

    return verticalScrollWidth;
};

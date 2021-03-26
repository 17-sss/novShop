// **********************************************************************************
// *** getWidth: 비율에 따른 width ***
/* 
    1. 비율에 따른 값 예시
        1= 1920 / 1.45= 1324  / 1.5= 1280  / 2= 960  
    2. screen 객체 프로퍼티 (availWidth, availHeight)
        https://rdsong.com/2146
    2-1. window 객체 프로퍼티 (outerwidth, outerHeight, innerWidth, innerHeight)
        https://sometimes-n.tistory.com/22

        
*/
// **********************************************************************************
export const getSize = (
    AnRatioStatic = 0,
    AstrType = 'width',
    AbManual = false,
    AbNopx = false,
) => {
    let result = 0;
    let screenSize = 0;
    let strType = AstrType.toLowerCase();
    let isMaxAvailWidth = false;

    if (AnRatioStatic === 1) isMaxAvailWidth = true;

    if (strType === 'width') {
        screenSize = global.screen.availWidth;
    } else if (strType === 'height') {
        screenSize = global.screen.availHeight;
    } else {
        screenSize = global.screen.availWidth;
    }

    if (!AbManual) {
        // [1] ratio :: 비율 에 따른 값 계산
        if (AnRatioStatic > 0) {
            result = Math.floor(screenSize / AnRatioStatic); // # Math.floor(): 소수점 버림.
        } // (AnRatioStatic가 0 이하 일 경우 미설정)
    } else {
        // [2] static :: 직접 입력
        // 숫자인지 먼저 확인 후.. (isNaN은 숫자가 아닐 경우 true를 반환하기에 !isNaN으로 작업)
        if (!isNaN(AnRatioStatic)) {
            result = Math.floor(AnRatioStatic);
        } // (AnRatioStatic가 숫자가 아닐경우 미설정)
    }

    let px = 'px';
    if (AbNopx) px = '';

    return result - (isMaxAvailWidth ? 18 : 0) + px;
};

// **********************************************************************************
// 문자열 replaceAll
// **********************************************************************************
export function replaceAll(str, searchStr, replaceStr) {
    return str.split(searchStr).join(replaceStr);
}

// **********************************************************************************
// 색상 랜덤 #000~#999
// **********************************************************************************
export function randomColor() {
    const random = () => {
        return String(Math.floor(Math.random() * 10));
    };

    let result = '';
    for (let index = 0; index <= 2; index++) {
        result = result + random();
    }

    return '#' + result;
}

// **********************************************************************************
// 이미지 비율을 계산하는 function (상품 상세 페이지에서 쓰임)
// **********************************************************************************
export const calcImageRatio = (AnNum, AstrType) => {
    const strType = AstrType !== ('width' && 'height') ? 'err' : AstrType;
    const nDiv10 = Number(getSize(1.5, strType, false, true)) / 10;
    return nDiv10 * AnNum + 'px';
};

// **********************************************************************************
// 빈 객체 or 배열인지 확인
// **********************************************************************************
export const isEmpty = (param) => {
    return Object.keys(param).length === 0;
};

// **********************************************************************************
// 숫자 3자리마다 , 입력
// **********************************************************************************
export const threeDigitsComma = (Anumber) => {
    if (typeof Anumber !== 'number') 
        return Anumber
    else
        return Anumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
};

// **********************************************************************************
// 정렬 (그냥 만들어봄) 
// **********************************************************************************
export const testSort = (arr, reverse = false) => {
    if (!arr || !(arr instanceof Array) || arr.length <= 0) return arr
    if (arr.length > 0) {
        for (let index = 0; index < arr.length-1; index++) {
            const num = arr[index];
            if (typeof num !== "number") 
                return arr
        }
    }
    if (arr.length < 2) return arr;

    for (let i = 0; i < arr.length; i++) {        
        for (let j = 0; j < arr.length; j++) {
            let tmp = 0, tmpI = i, tmpJ = j;

            if (reverse) {
                tmpI = j
                tmpJ = i;
            }

            if (arr[tmpI] < arr[tmpJ]) {    
                tmp = arr[tmpJ];
                arr[tmpJ] = arr[tmpI];
                arr[tmpI] = tmp;
            }
        }
    }    
    console.log(arr);
    return arr;
};

// **********************************************************************************
// 리덕스 Loading 개체 안에 있는 Flag들 (boolean 값) 전부 체크. 
// 하나라도 loading중이면 (true)면 false 리턴
// **********************************************************************************
export const objectFlagIsAllReady = (aObj) => {
    let bIsReady = true;

    const arrTmp = [];          
    for (const key in aObj) 
        arrTmp.push(aObj[key]);            
        
    for (let i = 0; i < arrTmp.length; i++) {
        const flag = arrTmp[i];
        if (flag) {
            bIsReady = false;
            break;
        };
    }  

    return bIsReady;
};
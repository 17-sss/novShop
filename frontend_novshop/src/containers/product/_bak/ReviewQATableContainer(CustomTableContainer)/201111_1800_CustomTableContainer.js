import React, { useState } from "react";
import CustomTable from "../../components/table/CustomTable";

const CustomTableContainer = (props) => {
    const {type, subjects, data} = props;
    // https://velog.io/@ksh4820/React-Pagination-구현 참고
    // 페이징 관련 변수 START =============================================
    let { onePageViewCnt } = props;
    onePageViewCnt = onePageViewCnt || 5;

    // --
    let pageCount = (data && data.length > 0) && Math.ceil(data.length / onePageViewCnt);    

    let pagingObjects = [];
    const createPagingObject = (pagenum, start, end) => ({pagenum, start, end});    
    function createPagingObjects () {

        for (let i = 0; i <= (pageCount-1); i++) {        
            let pagenum = i+1;
            let start = (i === 0) ? 1 : ((i * onePageViewCnt) + 1);
            let end = (pageCount === 1) ?  data.length : (i+1) * onePageViewCnt;
            if (end > data.length) 
                end = data.length;

            pagingObjects.push(createPagingObject(pagenum, start, end));
        }    
    }

    (data && (data.length > 0)) && createPagingObjects();    
    // 페이징 관련 변수 END =============================================   
    
    const [currentPage, setCurrentPage] = useState(1);
    const [datasPerPage] = useState(onePageViewCnt);
    
    const indexOfLast = currentPage * datasPerPage;
    const indexOfFirst = indexOfLast - datasPerPage;
    const currentDatas = data && data.slice(indexOfFirst, indexOfLast);
    console.log(currentDatas);

    return (
        <CustomTable
            type={type}
            subjects={subjects}
            data={data}
            pagingObjects={pagingObjects}
        />
    );
};

export default CustomTableContainer;
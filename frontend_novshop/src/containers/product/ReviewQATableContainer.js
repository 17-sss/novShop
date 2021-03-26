import React, { useEffect, useState } from "react";
import {useSelector} from 'react-redux';
import ReviewQATableTemplate from "../../components/product/ReviewQATableTemplate";

const ReviewQAContainer = (props) => {
    const { qaLoading, reviewLoading } = useSelector(({loading}) => {
        return {
            qaLoading: loading["qa/GET_PRODUCT_QA"],
            reviewLoading: loading["review/GET_PRODUCT_REVIEW"],
        }
    });
    
    const {type, subjects, data} = props;
    
    let { onePageViewCnt } = props;
    onePageViewCnt = onePageViewCnt || 5;
    const pageCount = (data && data.length > 0) && Math.ceil(data.length / onePageViewCnt);        

    const [currentPage, setCurrentPage] = useState(1);
    const [currentDatas, setCurrentDatas] = useState([]);
    const [loadingOK, setLoadingOK] = useState(false);
    const [datasPerPage] = useState(onePageViewCnt);    
    
    const pagingBtnClick = (e) => {
        e.preventDefault();
        const {value} = e.target;
        if (!value || value <= 0) return;
        setCurrentPage(value);        
    }    

    useEffect(() => {        
        if (!qaLoading && !reviewLoading) 
            setLoadingOK(true);        
    }, [qaLoading, reviewLoading])


    useEffect(()=> {
        const indexOfLast = currentPage * datasPerPage;
        const indexOfFirst = indexOfLast - datasPerPage;

        const createTmpData = () => {
            let tmpData = data && data.slice(indexOfFirst, indexOfLast);
            (tmpData && tmpData.length > 0) && setCurrentDatas(tmpData);  
        };
        
        if (loadingOK) createTmpData();
        
    }, [currentPage, datasPerPage, data, loadingOK])

    const events = {pagingBtnClick};

    return (
        <ReviewQATableTemplate
            type={type}
            subjects={subjects}
            data={(currentDatas && currentDatas.length > 0) && currentDatas}
            currentPage = {currentPage}
            pageCount = {pageCount}
            events={events}
        />
    );
};

export default ReviewQAContainer;
import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import Icon from './icons.js';



function _Pagination(props) {
    let total_count = props.total_count;
    let per_page = props.per_page;
    
    //let offset = props.offset;
    //let currentPage = Math.ceil(offset / per_page) + 1;
    let currentPage = props.currentPage;

    let total_pages = Math.ceil(total_count / per_page);

    if (currentPage > total_pages || currentPage < 1)
        currentPage = 1;

    let queryString = new URLSearchParams(props.location.search);
    //queryString.delete('page');
    //queryString = queryString.toString();

    let prevArrow;
    if (currentPage === 1) 
        prevArrow = <span><Icon name="chevron-left" /></span>;
    else {
        queryString.set('page', currentPage - 1);
        prevArrow = <Link to={{search: queryString.toString()}} onClick={props.onPageClick}><Icon name="chevron-left" /></Link>;
    }

    let nextArrow;
    if (currentPage === total_pages || total_pages === 0) 
        nextArrow = <span><Icon name="chevron-right" /></span>;
    else {
        queryString.set('page', currentPage + 1);
        nextArrow = <Link to={{search: queryString.toString()}} onClick={props.onPageClick}><Icon name="chevron-right" /></Link>;
    }

    let pages = []

    if (total_pages < 8) {
        for (let i = 1; i <= total_pages; i++) {
            if (i === currentPage)
                pages.push(<span className="active" key={i}>{i}</span>);
            else {
                queryString.set('page', i)
                pages.push(<Link to={{search: queryString.toString()}} key={i} onClick={props.onPageClick}>{i}</Link>);
            }
        }
    } else {
        let _pages = new Set();
        
        _pages.add(1);

        if (currentPage === 1) {
            _pages.add(2);
            _pages.add(3);
        }
        else if (currentPage === total_pages) {
            _pages.add(total_pages - 2);
            _pages.add(total_pages - 1);
        }
        else {
            _pages.add(currentPage - 1);
            _pages.add(currentPage);
            _pages.add(currentPage + 1);
        }

        _pages.add(total_pages);

        for (let i of _pages) {
            if (i !== 1) {
                if (!_pages.has(i - 1))
                    pages.push(<span key={i-1}>...</span>);
            }

            if (i === currentPage)
                pages.push(<span className="active" key={i}>{i}</span>);
            else {
                queryString.set('page', i);
                pages.push(<Link to={{search: queryString.toString()}} key={i} onClick={props.onPageClick}>{i}</Link>);
            }
        }
    }

    return (
        <div className="pagination">
            {prevArrow}
            {pages}
            {nextArrow}
            <span>(Total: {total_count})</span>
        </div>
    );
} 


const Pagination = withRouter(_Pagination);

export default Pagination;
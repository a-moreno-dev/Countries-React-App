import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPagination } from '../../redux/actions';
import './PaginationBar.css'

const PaginationBarComponent = () => {
    const countries = useSelector(state => state.countries);
    const dispatch = useDispatch();
    const handlerPage = (event) => {
        const nextPage = Number(event.target.innerText);
        if (nextPage > 0) dispatch(setPagination({ page: nextPage }));
    }
    const [pages, setPages] = useState([])
    let pagination = [];
    const makePagination = () => {
        if (Array.isArray(countries) && countries.length > 16) {
            const items = Math.ceil(countries.length / 16);
            for (let i = 1; i <= items; i++) {
                pagination.push(
                    <li
                        key={i}
                        onClick={handlerPage}
                        className="pagination-item">{i}</li>
                )
            }
            setPages(pagination);
        }
        else {
            setPages([<li key='1' className="pagination-item">-</li>,]);
        }
    }

    useEffect(() => {
        makePagination();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countries])

    return (
        <article
            className='pagination'>
            <ul>{pages}</ul>
        </article>
    );
}

export default PaginationBarComponent;
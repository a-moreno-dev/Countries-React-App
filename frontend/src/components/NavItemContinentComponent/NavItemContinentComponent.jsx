import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BsFillGridFill, BsChevronRight } from "react-icons/bs";
import { setCountriesByContinent } from '../../redux/actions';
import './NavItemContinent.css';

const NavItemContinentComponent = ({ region }) => {

    const dispatch = useDispatch()
    const brouserNavigate = useNavigate();
    const handlerGridView = () => {
        if (region && region.length > 0) {
            dispatch(setCountriesByContinent({ region }));
            brouserNavigate('/countries');
        }
    }

    return (
        <li className='nav-item' id='nav-item' onClick={handlerGridView} >
            <span> <BsFillGridFill /> {region} </span><BsChevronRight className='svg-arrow' />
        </li>
    )
};

export default NavItemContinentComponent;
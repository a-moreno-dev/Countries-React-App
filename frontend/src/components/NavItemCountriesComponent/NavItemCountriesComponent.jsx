import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCountryDetail } from '../../redux/actions';
import { BsGeoAltFill, BsChevronRight } from "react-icons/bs";

const NavItemCountriesComponent = ({ country }) => {

    const dispatch = useDispatch();
    const brouserNavigate = useNavigate();
    const handlerCountryDetail = () => {
        if (Object.entries(country).length) {
            dispatch(setCountryDetail({ code: country.alpha3Code }));
            brouserNavigate('/countries/country-detail');
        }
    }

    return (
        <li className='nav-item' id='nav-item' onClick={handlerCountryDetail}>
            <span><BsGeoAltFill /> {country.name.slice(0, 18)}</span>
            <BsChevronRight className='svg-arrow'/>
        </li>
    );
}

export default NavItemCountriesComponent;
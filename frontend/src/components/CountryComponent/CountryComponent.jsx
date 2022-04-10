import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCountryDetail } from '../../redux/actions';
import './Country.css'

const CountryComponent = ({ country }) => {
    const brouserNavigate = useNavigate();
    const dispatch = useDispatch();

    const handlerCountryDetail = () => {
        dispatch(setCountryDetail({ code: country.alpha3Code }));
        brouserNavigate('/countries/country-detail');
        return;
    }

    return (
        <div className="card" onClick={handlerCountryDetail}>
            <div className='card-flag'>
                <img src={country.flag} alt="flag" />
            </div>
            <div className='card-info'>
                <span>{country.name}</span>
                <span>{country.region}</span>
            </div>
        </div>
    )
}

export default CountryComponent;
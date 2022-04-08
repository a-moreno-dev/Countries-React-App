import React from 'react';
import { useSelector } from 'react-redux';
import NavItemCountriesComponent from '../NavItemCountriesComponent/NavItemCountriesComponent';
import './NavCountries.css';

const NavCountriesComponent = () => {

    const countries = useSelector(state => state.countries);
    const _countries = (Array.isArray(countries) && countries.length > 0) ?
        countries.map(country =>
            <NavItemCountriesComponent key={country.alpha3Code} country={country} />) :
        [];

    return (
        <div className='nav-vertical'>
            <ul className='col-countries'>
                {_countries}
                {/* {_countries.slice(0, 14)} */}
            </ul>
        </div>
        );
       
}

export default NavCountriesComponent;
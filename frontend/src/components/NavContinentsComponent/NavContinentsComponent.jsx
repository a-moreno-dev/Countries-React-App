import React from 'react';
import NavItemContinentComponent from '../NavItemContinentComponent/NavItemContinentComponent';
import './NavContinents.css';

const NavContinentsComponent = () => {
    return (
        <ul className='nav-vertical col-contients'>
        <NavItemContinentComponent region={'All Countries'} />
        <NavItemContinentComponent region={'africa'} />
        <NavItemContinentComponent region={'americas'} />
        <NavItemContinentComponent region={'antarctic'} />
        <NavItemContinentComponent region={'asia'} />
        <NavItemContinentComponent region={'europe'} />
        <NavItemContinentComponent region={'oceania'} />
        <NavItemContinentComponent region={'polar'} />
        </ul>
    )
}

export default NavContinentsComponent;
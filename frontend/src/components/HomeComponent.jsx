import React from 'react';
import { Outlet } from "react-router-dom";
import NavContinentsComponent from './NavContinentsComponent/NavContinentsComponent';
import NavCountriesComponent from './NavCountriesComponent/NavCountriesComponent';
import ActionBarComponent from './ActionBarComponent/ActionBarComponent';
import './Home.css'

const HomeComponent = () => {
  return (
    <div className='home'>
      <header> <ActionBarComponent /> </header>
      <main className='row'>
        <NavContinentsComponent />
        <NavCountriesComponent />
        <section className='col outlet'> <Outlet />
        </section>
      </main>
    </div>
  );
}

export default HomeComponent;
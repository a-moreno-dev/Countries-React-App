import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route } from "react-router-dom";
import { setInitialState } from './redux/actions';
import LandingPageComponent from './components/LandingPageComponent/LandingPageComponent';
import HomeComponent from './components/HomeComponent';
import CountriesComponent from './components/CountriesComponent/CountriesComponent';
import CountryDetailComponent from './components/CountryDetailComponent/CountryDetailComponent';
import AddActivityFormComponent from './components/AddActivityFormComponent/AddActivityFormComponent';
import ActivityToCountryComponent from './components/AddActivityFormComponent/ActivityToCountryComponent';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => dispatch(setInitialState()), [dispatch]);

  return <>
    <Routes>
      <Route path='/' element={<LandingPageComponent />} />
      <Route path='/countries/*' element={<HomeComponent />}>
        <Route path="" element={<CountriesComponent />} />
        <Route path="country-detail" element={<CountryDetailComponent />} />
        <Route path="add-activity" element={<AddActivityFormComponent />} />
        <Route path="add-activity-to-country" element={<ActivityToCountryComponent />} />
      </Route>
    </Routes>
  </>;
}

export default App;
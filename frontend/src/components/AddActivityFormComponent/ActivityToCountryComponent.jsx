import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BsXDiamond, BsFillXSquareFill } from "react-icons/bs";
import {
    setActivityToCountries,
    savetActivityToCountries,
    removeActivityFromActivityToCountries,
    getCountriesWithoutActivity
} from '../../redux/actions';
import CountryComponent from '../CountryComponent/CountryComponent';
import './ActivityToCountry.css';

const ActivityToCountryComponent = () => {

    const dispatch = useDispatch();

    const {
        activities,
        activityToCountries,
        countriesWithoutActivities
    } = useSelector(state => state);

    let _countriesWithoutActivities = []
    
    if (Array.isArray(activities) && activities.length > 0)
        _countriesWithoutActivities = countriesWithoutActivities;

    const getKey = () =>
        ((Date.now() + "" + Math.random()).replace(/\./g, ''))

    const [activityOption, setActivityOption] = useState({ id: 0, option: 'Select an activity' });

    const handlerActivitySelect = (event) => {
        const { value } = event.target;
        if (Number(value) === 0) {
            alert('This activity is not allowed.');
            return;
        }
        const name = event.target.options[event.target.selectedIndex].text;
        setActivityOption({ ...activityOption, id: value, option: name });
        dispatch(getCountriesWithoutActivity({ activityId: value }));
    }

    const [countryOption, setCountryOption] = useState('Select Countries');
    const handlerCountrySelect = (event) => {
        if (activityOption.id <= 0) {
            alert('There is not an activity selected.');
            return;
        }
        const name = event.target.options[event.target.selectedIndex].text;
        setCountryOption(name);
        dispatch(
            setActivityToCountries(
                { countryCode: event.target.value }
            )
        );
    }

    const handlerAddActivityToCountries = () => {
        const activityCountries = [];
        if (
            Array.isArray(activityToCountries) &&
            activityToCountries.length > 0 &&
            activityOption.id > 0
        ) {
            for (let country of activityToCountries) {
                activityCountries.push(
                    { alpha3Code: country.alpha3Code, activity_id: activityOption.id }
                );
            }
            dispatch(
                savetActivityToCountries({ activityCountries: activityCountries })
            );
        }
        return;
    }

    const handlerRemoveActivityFromActivityToCountries = (code) =>
        dispatch(removeActivityFromActivityToCountries(code));

    const msg = activityToCountries.length > 0 ?
        null :
        <h1 className='warning' style={{ color: '#ffae51' }}>
            There are not countries selected
        </h1>;

    return (
        <div id='activity-to-countries'>
            <div className='form-selects'>
                <h1><BsXDiamond /> Add Activity To Countries</h1>
                <select 
                onChange={(e) => handlerActivitySelect(e)}
                style={{'width':'25%'}}>
                    <option key={0} value={0}>{activityOption.option}</option>
                    {
                        activities.map(activity =>
                            <option
                                key={activity.id + activity.name}
                                value={activity.id} >
                                {activity.name}
                            </option>)
                    }
                </select>
                <select 
                onChange={handlerCountrySelect}
                style={{'width':'25%'}}>
                    <option key={'default'} value={''}>{countryOption}</option>
                    {
                        _countriesWithoutActivities.map(country =>
                            <option
                                key={country.alpha3Code + country.name}
                                value={country.alpha3Code}>
                                {country.name.slice(0, 25)}
                            </option>)
                    }
                </select>
                <button onClick={handlerAddActivityToCountries}>ADD</button>
            </div>
            <div id='country-grid'>
                {msg}
                {
                    activityToCountries.map(country =>
                        <div className='card-container'>
                            <BsFillXSquareFill
                                onClick={() => handlerRemoveActivityFromActivityToCountries({ code: country.alpha3Code })}
                                className='close' />
                            <CountryComponent
                                key={getKey()}
                                country={country} />
                        </div>)
                }
            </div>
        </div>
    )
}

export default ActivityToCountryComponent;
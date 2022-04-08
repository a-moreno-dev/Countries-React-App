import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    searchCountry,
    sortCountries,
    setCountriesByActivity,
    defaultAction
} from '../../redux/actions';
import {
    BsSearch,
    BsArrowDownUp,
    BsGear,
    BsFunnel,
    BsGlobe2
} from "react-icons/bs";
import './ActionBar.css'

const ActionBarComponent = () => {
    console.log('Start ActionBarComponent');
    const brouserNavigation = useNavigate();
    const dispatch = useDispatch();
    const handlerSelectChange = (event) => {
        if (event.target.value.length > 0) {
            dispatch(setCountriesByActivity({ activityId: event.target.value }));
            brouserNavigation('/countries');
        }
    }
    const clearField = (event) => {
        event.target.value = '';
    }
    const sort = useSelector(state => state.sort)
    const handlerSortByCountryName = () => {
        sort === 'upNameComparator' ?
            dispatch(sortCountries('downNameComparator')) :
            dispatch(sortCountries('upNameComparator'));
    }
    const handlerSortByCountryPopulation = () => {
        sort === 'upPopulationComparator' ?
            dispatch(sortCountries('downPopulationComparator')) :
            dispatch(sortCountries('upPopulationComparator'));
    }
    const [searchInputValue, setSearchInputValue] = useState('');
    const handlerInputChange = (event) => {
        setSearchInputValue(event.target.value);
    }
    useEffect(() => {
        if (searchInputValue.length > 0) {
            dispatch(searchCountry({ countryName: searchInputValue }));
            brouserNavigation('/countries');
        } else {
            dispatch(defaultAction());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInputValue]);

    const activities = useSelector(state => state.activities);
    let _activities = (Array.isArray(activities) && activities.length > 0) ? activities : [];

    return (
        <nav className='row'>
            <div
            style={{'cursor':'pointer'}}
                className='logo'
                onClick={() => brouserNavigation('/')}>
                <BsGlobe2 />
                <h1>Countries App</h1>
            </div>
            <ul className='menu'>
                <li onClick={handlerSortByCountryName} >
                    <BsArrowDownUp /> Order By Name
                </li>

                <li onClick={handlerSortByCountryPopulation} >
                    <BsArrowDownUp /> Order By Population
                </li>

                <li onClick={() => brouserNavigation('/countries/add-activity')}>
                    <BsGear /> Manage Activities
                </li>
                <li>
                    <form onSubmit={e => e.preventDefault()}>
                        <BsFunnel />
                        <select onChange={(e) => handlerSelectChange(e)} id="activity-filter">
                            <option key={'defaul'} value=''>Activities Filter</option>
                            {
                                _activities.map(activity =>
                                    <option
                                        key={activity.id}
                                        value={activity.id}>
                                        {activity.name}
                                    </option>)
                            }
                        </select>
                    </form>
                </li>
            </ul>
            <div className='search'>
                <input
                    type='text'
                    value={searchInputValue}
                    onChange={handlerInputChange}
                    onClick={clearField}
                    placeholder='Search Countries' />
                <span><BsSearch /></span>
            </div>
        </nav>
    )
}

export default React.memo(ActionBarComponent);
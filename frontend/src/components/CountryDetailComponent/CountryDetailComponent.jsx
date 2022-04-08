import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BsXDiamond, BsTrash } from "react-icons/bs";
import {
    removeActivityFromCountry,
    setCountryDetail,
    setCountryActivities
} from '../../redux/actions';
import SelectActivity from './SelectActivity';
import './SelectActivity.css';
import './CountryDetail.css';

const CountryDetailComponent = () => {
    const brouserNavigate = useNavigate();
    const { country, countryActivities } = useSelector(state => state);
    const dispatch = useDispatch();
    const {
        alpha3Code, name, capital, region, subregion, timezones, numericCode,
        population, flag, area, independent, callingCodes, borders
    } = country;

    useEffect(() => {
        dispatch(setCountryActivities({ activities: country.activities }))
    }, [])

    const difficultyLevel = {
        1: ' - Low',
        2: ' - Middle Low',
        3: ' - Middle',
        4: ' - Middle High',
        5: ' - High'
    };

    let msgBorders = <h3 className='warning' style={{ color: '#dfbd00;', textAlign: 'center', width: '100%', marginTop: '20%' }}>
        This country has not other country borders.
    </h3>;
    let _borders2 = [];
    let _activities = [];
    // let title = 'Not country borders';

    const handlerCountryDetail = (code) => {
        dispatch(setCountryDetail({ code }));
        brouserNavigate('/countries/country-detail');
        return;
    }

    if (Array.isArray(borders) && borders.length > 0) {
        _borders2 = borders.map(
            country =>
                <tr
                    key={country.alpha3Code}
                    onClick={() => handlerCountryDetail(country.alpha3Code)}>
                    <td className='flag'><img src={country.flag} alt='img' /></td>
                    <td className='name'><span>{country.name}</span></td>
                </tr>
        );
        msgBorders = null;
    }

    let msgActivities = <h2 className='warning' style={{ color: '#ffae51', textAlign: 'center', width: '100%' }}>
        This country has not activities assigned.
    </h2>;

    const hendlerReoveActivitty = (country_id, activity_id) => {
        if (country_id.length === 3 && Number(activity_id) > 0) {
            dispatch(removeActivityFromCountry(
                { countryId: country_id.toLowerCase(), activityId: activity_id }
            ))
        }
    }

    if (Array.isArray(countryActivities) && countryActivities.length > 0) {
        countryActivities.sort((prev, next) => {
            if (prev.name > next.name) return 1;
            if (prev.name < next.name) return -1;
            return 0;
        })
        _activities = countryActivities.map(activity => (
            <tr key={activity.id}>
                <td style={{ width: '25%' }}>{activity.name}</td>
                <td style={{ width: '6%' }}>{activity.duration}</td>
                <td style={{ width: '14%' }}>
                    {activity.difficulty}
                    {difficultyLevel[activity.difficulty]}
                </td>
                <td style={{ width: '6%' }}>{activity.season}</td>
                <td
                    onClick={() => hendlerReoveActivitty(alpha3Code, activity.id)}
                    style={{ width: '6%', textAlign: 'center', cursor: 'pointer' }}>
                    <BsTrash style={{ color: 'red' }} />
                </td>
            </tr>
        ));
        msgActivities = null;
    }

    return (
        <div id='detail-content'>

            <header id='header-detail'>
                <div id='country-flag'>
                    <img src={flag} alt={name} />
                </div>
                <div className='country-data'>
                    <table className='table-detail'>
                        <tbody>
                            <tr>
                                <th><BsXDiamond /> name</th><td className='td-first'>{name}</td>
                                <th><BsXDiamond /> capital</th><td className='td-first'>{capital}</td>
                            </tr>
                            <tr>
                                <th><BsXDiamond /> Code</th><td className='td-first'>{alpha3Code}</td>
                                <th><BsXDiamond /> demonym</th><td>{name}</td>
                            </tr>
                            <tr>
                                <th><BsXDiamond /> region</th><td className='td-first'>{region}</td>
                                <th><BsXDiamond /> subregion</th><td>{subregion}</td>
                            </tr>
                            <tr>
                                <th><BsXDiamond /> population</th><td className='td-first'>{population}</td>
                                <th><BsXDiamond /> area</th><td>{area} KM<sup>2</sup></td>
                            </tr>
                            <tr>
                                <th><BsXDiamond /> timezones</th><td className='td-first'>{timezones}</td>
                                <th><BsXDiamond /> numericCode</th><td>{numericCode}</td>
                            </tr>
                            <tr>
                                <th><BsXDiamond /> independent</th><td className='td-first'>{independent}</td>
                                <th><BsXDiamond /> callingCodes</th><td>{callingCodes}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </header>

            <footer id='footer-details'>

                <div id='footer-item'>
                    <h3><BsXDiamond /> Tourist activities</h3>
                    <SelectActivity countryId={alpha3Code} title={'Add activity to country'} />
                    <div id='item-grid'>
                        <table className='table-activities-head'>
                            <thead>
                                <tr>
                                    <th style={{ width: '25%' }}><BsXDiamond /> Name</th>
                                    <th style={{ width: '6%' }}>Duration</th>
                                    <th style={{ width: '14%' }}>Difficulty</th>
                                    <th style={{ width: '6%' }}>Season</th>
                                    <th style={{ width: '6%' }}>Delete</th>
                                </tr>
                            </thead>
                        </table>
                        <div className='container-overflow'>
                            <table className='table-activities'>
                                <tbody> {_activities} </tbody>
                            </table>
                            {msgActivities}
                        </div>
                    </div>
                </div>

                <div id='footer-item'>
                    <h3><BsXDiamond /> Country Borders</h3>
                    <div id='item-grid'>
                        <div className='borders-overflow'>
                            <table className='table-borders'>
                                <tbody> {_borders2} </tbody>
                            </table>
                            {msgBorders}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default CountryDetailComponent;
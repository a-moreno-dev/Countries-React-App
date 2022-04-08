import React from 'react';
import { connect } from 'react-redux';
import { BsXDiamond, BsTrash } from "react-icons/bs";
import { removeActivityFromCountry } from '../../redux/actions';
import CountryComponent from '../CountryComponent/CountryComponent';
import SelectActivity from '../ActionBarComponent/SelectActivity';
import '../CountryDetailComponent/CountryDetailComponent.css';

const CountryDetailComponent = (
    {
        storeCountry,
        storeActivities,
        dispatchRemoveActivity
    }
) => {
    const {
        alpha3Code, name, gini, capital, currencies, region,
        subregion, timezones, numericCode, population, flag,
        area, independent, callingCodes, borders
    } = storeCountry;

    const difficultyLevel = {
        1: ' - Low',
        2: ' - Middle Low',
        3: ' - Middle',
        4: ' - Middle High',
        5: ' - High'
    };

    let msgBorders = <h2 className='warning' style={{ color: '#ffae51', textAlign: 'center', width: '100%' }}>
        This country has not other country borders.
    </h2>;
    let _borders = [];
    let _activities = [];
    let title = 'Not country borders';

    if (Array.isArray(borders) && borders.length > 0) {
        _borders = borders.map(
            country => <CountryComponent
                key={country.alpha3Code}
                country={country} />
        );
        title = 'border countries';
        msgBorders = null;
    }

    let msgActivities = <h2 className='warning' style={{ color: '#ffae51', textAlign: 'center', width: '100%' }}>
        This country has not activities assigned.
    </h2>;
    if (Array.isArray(storeActivities) && storeActivities.length > 0) {
        _activities = storeActivities.map(activity => (
            <tr key={activity.id}>
                <td>{activity.name}</td>
                <td>{activity.duration}</td>
                <td>
                    {activity.difficulty}
                    {difficultyLevel[activity.difficulty]}
                </td>
                <td>{activity.season}</td>
                <td
                    onClick={() => hendlerReoveActivitty(alpha3Code, activity.id)}
                    style={{ width: '10%', textAlign: 'center', cursor: 'pointer' }}>
                    <BsTrash style={{ color: 'red' }} />
                </td>
            </tr>
        ));
        msgActivities = null;
    }

    const hendlerReoveActivitty = (country_id, activity_id) => {
        if (country_id.length === 3 && Number(activity_id) > 0)
            dispatchRemoveActivity({ countryId: country_id.toLowerCase(), activityId: activity_id })
    }

    return (
        <div id='detail'>

            <header id='header-detail'>
                <div id='country-flag'>
                    <img src={flag} alt={name} />
                </div>
                <div className='country-data'>
                    <table className='table-detail'>
                        <tbody>
                            <tr>
                                <th><BsXDiamond /> country</th><td className='td-first'>{name}</td>
                                <th><BsXDiamond /> demonym</th><td>{name}</td>
                            </tr>
                            <tr>
                                <th><BsXDiamond /> Code</th><td className='td-first'>{alpha3Code}</td>
                                <th><BsXDiamond /> gini</th><td>{gini}</td>
                            </tr>
                            <tr>
                                <th><BsXDiamond /> capital</th><td className='td-first'>{capital}</td>
                                <th><BsXDiamond /> currencies</th><td>{currencies}</td>
                            </tr>
                            <tr>
                                <th><BsXDiamond /> region</th><td className='td-first'>{region}</td>
                                <th><BsXDiamond /> subregion</th><td>{subregion}</td>
                            </tr>
                            <tr>
                                <th><BsXDiamond /> timezones</th><td className='td-first'>{timezones}</td>
                                <th><BsXDiamond /> numericCode</th><td>{numericCode}</td>
                            </tr>
                            <tr>
                                <th><BsXDiamond /> population</th><td className='td-first'>{population}</td>
                                <th><BsXDiamond /> area</th><td>{area} KM2</td>
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
                    <h1><BsXDiamond /> Tourist activities</h1>
                    <SelectActivity countryId={alpha3Code} title={'Add activity to country'} />
                    <div id='footer-item-grid'>
                        <table className='table-footr-detail-0'>
                            <thead>
                                <tr>
                                    <th><BsXDiamond /> Name</th>
                                    <th><BsXDiamond /> Duration</th>
                                    <th><BsXDiamond /> Difficulty</th>
                                    <th><BsXDiamond /> Season</th>
                                    <th style={{ width: '15%' }}><BsXDiamond /> Delete</th>
                                </tr>
                            </thead>
                        </table>
                        <div className='table-overflow'>
                            <table className='table-footr-detail'>
                                <tbody>
                                    {_activities}
                                </tbody>
                            </table>
                            {msgActivities}
                        </div>
                    </div>
                </div>

                <div id='footer-item'>
                    <h1><BsXDiamond /> {title}</h1>
                    <div id='footer-item-grid'>{_borders}{msgBorders}</div>
                </div>

            </footer>
        </div>
    )
}

const mapStateToProps = (state) => (
    { storeCountry: state.country, storeActivities: state.countryActivities });

const mapDispatchToProps = (dispatch) => (
    {
        dispatchRemoveActivity:
            ({ activityId, countryId }) =>
                dispatch(removeActivityFromCountry({ activityId, countryId }))
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(CountryDetailComponent);
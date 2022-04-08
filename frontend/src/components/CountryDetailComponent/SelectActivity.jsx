import React from 'react';
import { BsPlusCircle } from 'react-icons/bs';
import { useSelector, useDispatch } from 'react-redux';
import { addActivityToCountry } from '../../redux/actions';
import './SelectActivity.css';

const SelectActivity = ({ countryId }) => {
    
    const dispatch = useDispatch();

    const handlerSelectChange = (event) => {
        dispatch(addActivityToCountry(
            {
                countryId: countryId.toLowerCase(),
                activityId: event.target.value
            }
        ));
    }

    const { activities, countryActivities } = useSelector(state => state)

    let _activities = [];

    if (
        Array.isArray(activities) &&
        Array.isArray(countryActivities) &&
        countryActivities.length > 0
    ) {
        _activities = activities.filter(aActivity =>
            !countryActivities.some(cActivity => cActivity.id === aActivity.id));
    } else {
        _activities = activities;
    }

    _activities.sort((prev, next) => {
        if (prev.name > next.name) return 1;
        if (prev.name < next.name) return -1;
        return 0;
    })

    return (
        <form
        id='form-actvities'
        onSubmit={e => e.preventDefault()}>
            <BsPlusCircle />
            <select onChange={(e) => handlerSelectChange(e)}>
                <option value=''>Select an activity</option>
                {
                    _activities.map(activity =>
                        <option
                            key={activity.id}
                            value={activity.id} >
                            {activity.name}
                        </option>)
                }
            </select>
        </form>
    )
}

export default SelectActivity;
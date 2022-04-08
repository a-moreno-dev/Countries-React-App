import React from 'react';
import { useSelector } from 'react-redux';

const SelectActivity = ({ countryId }) => {
    const handlerSelectChange = (event) => {
    }
    const activities = useSelector(state => state.activities)

    return (
        <form id='form-actvities' onSubmit={e => e.preventDefault()}>
            <label>Add activity</label>
            <select
                onChange={(e) => handlerSelectChange(e)}
                id="select-activity">
                <option key={'defaul'} disabled selected value hidden>Select Activity</option>
                {
                    activities.map(activity =>
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
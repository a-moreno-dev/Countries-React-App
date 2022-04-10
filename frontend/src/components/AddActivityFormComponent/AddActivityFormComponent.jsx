import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    BsTrash,
    BsXDiamond,
    BsPencil,
    BsStack
} from "react-icons/bs";
import { createActivity, removeActivity, updateActivity } from '../../redux/actions';
import Activity from '../../redux/activity';
import './AddActivityForm.css';

const AddActivityFormComponent = (
    {
        storeActivities,
        dispatchCreateActivity,
        dispatchRemoveActivity,
        dispatchUpdateActivity
    }
) => {
    let activities = [];
    const difficultyLevel = {
        1: ' - Low',
        2: ' - Middle Low',
        3: ' - Middle',
        4: ' - Middle High',
        5: ' - High'
    };
    const handlerEdit = (activity) => {
        setFormValues({
            id: activity.id,
            name: activity.name,
            difficulty: activity.difficulty,
            duration: activity.duration,
            season: activity.season
        })
    }

    let msg = <h2 className='warning' style={{ color: '#ffae51', textAlign: 'center' }}>
        There are no activities to show yet.<br />
        Create an activity in the "Create Activity" form, please.
    </h2>;

    if (storeActivities && storeActivities.length > 0) {
        activities = storeActivities.map(
            activity =>
                <tr key={activity.id}>
                    <td>{activity.name}</td>
                    <td>{activity.difficulty}{difficultyLevel[activity.difficulty]}</td>
                    <td>{activity.duration}</td>
                    <td>{activity.season}</td>
                    <td
                        onClick={() => handlerEdit(activity)}
                        id='edit'> <BsPencil />
                    </td>
                    <td
                        onClick={() => dispatchRemoveActivity(activity.id)}
                        id='delete'> <BsTrash />
                    </td>
                </tr>
        );
        msg = null;
    }
    const [formValues, setFormValues] = useState({
        name: '',
        difficulty: '1',
        duration: '01:00:00',
        season: 'fall'
    });
    const [formErrors, setFormErrors] = useState({
        name: null,
        difficulty: null,
        duration: null,
        season: null,
        success: false
    });
    const handlerSubmit = (event) => {
        event.preventDefault();
        formValues.id > 0 ?
            dispatchUpdateActivity(new Activity(formValues)) :
            dispatchCreateActivity(new Activity(formValues));
        handlerReset();
    }
    const escapeRegExp = (string) => {
        return string.trim().replace(/[^a-z0-9-_]+/gi, "");
    }
    const seasons = ['fall', 'spring', 'summer', 'winter'];
    const handlerChange = (event) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: escapeRegExp(value) });

        if (name === 'name') {
            if (value.length === 0) {
                setFormErrors({ ...formErrors, name: 'This fiels is required.' });
                return;
            }
            if (value.length <= 2) {
                setFormErrors({ ...formErrors, name: 'This value is too short.' });
                return;
            }
        }
        if (name === 'duration') {
            if (value === '00:00:00') {
                setFormErrors({ ...formErrors, [name]: '00:05:00' });
                setFormValues({ ...formValues, [name]: '00:05:00' });
                return;
            }
        }
        if (name === 'difficulty') {
            if (value < 0 || value > 5) {
                setFormErrors({ ...formErrors, [name]: 'This value is not allowed.' });
                return;
            }
        }
        if (name === 'season') {
            if (!seasons.includes(value)) {
                setFormErrors({ ...formErrors, [name]: 'This fiels is required.' });
                return;
            }
        }
        setFormErrors({ name: null, duration: null, difficulty: null, seasons: null, status: true });
    }

    const handlerReset = () => {
        setFormValues({
            name: '',
            difficulty: '1',
            duration: '01:00:00',
            season: 'fall'
        })
    }

    return (
        <div id='activity-container'>
            <Link id='add-countries' to='/countries/add-activity-to-country'>
                <div>
                    <BsStack /> Click here to add activity to countries
                </div>
            </Link>
            <section id='manage-activities'>
                <div id='form'>
                    <h1>
                        <BsXDiamond />
                        {formValues.id ? 'Edit' : 'Create'} Activity
                    </h1>
                    <form
                        onSubmit={(event) => handlerSubmit(event)}
                        id='form-activity'>
                        <div className='form-control-group'>
                            <div className='form-control'>
                                <label>Activity Name</label>
                                <input
                                style={{'borderRadius':'0.3em', 'border':'solid #d1d1d1 0.1em'}}
                                    type='text'
                                    name='name'
                                    id='name'
                                    minLength='3'
                                    maxLength='45'
                                    required
                                    onChange={handlerChange}
                                    value={formValues.name}
                                    autoComplete='off'
                                />
                            </div>
                            <div className='form-control'>
                                <label>
                                    Duration
                                </label>
                                <input
                                style={{'borderRadius':'0.3em', 'border':'solid #d1d1d1 0.1em'}}
                                    type='time'
                                    name='duration'
                                    id='duration'
                                    required
                                    step='2'
                                    onChange={handlerChange}
                                    value={formValues.duration}
                                />
                            </div>
                        </div>
                        <div className='form-control'>
                            <label>Difficulty</label>
                            <datalist id='difficulty'>
                                <option value='1' label='1'></option>
                                <option value='2' label='2'></option>
                                <option value='3' label='3'></option>
                                <option value='4' label='4'></option>
                                <option value='5' label='5'></option>
                            </datalist>
                            <input
                                type='range'
                                min='1'
                                max='5'
                                step='1'
                                name='difficulty'
                                id='_difficulty'
                                onChange={handlerChange}
                                value={formValues.difficulty}
                                list='difficulty' />
                        </div>

                        <div className='form-control'>
                            <label>Season : {formValues.id}</label>
                        </div>

                        <div className='form-control-radios'>
                            <div>
                                <label>
                                    <input
                                        className='radio'
                                        type='radio'
                                        id='fall'
                                        onChange={handlerChange}
                                        checked={formValues.season.toLowerCase() === 'fall'}
                                        name='season'
                                        value='fall' />
                                    Fall
                                </label>
                            </div>
                            <div>
                                <label>
                                    <input
                                        className='radio'
                                        type='radio'
                                        id='spring'
                                        onChange={handlerChange}
                                        checked={formValues.season.toLowerCase() === 'spring'}
                                        name='season'
                                        value='spring' />
                                    Spring
                                </label>
                            </div>
                            <div>
                                <label>
                                    <input
                                        className='radio'
                                        type='radio'
                                        id='summer'
                                        onChange={handlerChange}
                                        checked={formValues.season.toLowerCase() === 'summer'}
                                        name='season'
                                        value='summer' />
                                    Summer
                                </label>
                            </div>
                            <div>
                                <label>
                                    <input
                                        className='radio'
                                        type='radio'
                                        id='winter'
                                        onChange={handlerChange}
                                        checked={formValues.season.toLowerCase() === 'winter'}
                                        name='season'
                                        value='winter' />
                                    Winter
                                </label>
                            </div>
                        </div>

                        <div className='buttons'>
                            <button onClick={handlerReset} type='reset'>Clear Fields</button>
                            <button type='submit'>{formValues.id ? 'Edit' : 'Create'} Activity</button>
                        </div>

                        <div id='validation'>
                            <table>
                                <thead>
                                    <tr>
                                        <th><BsXDiamond />  Name </th>
                                        <td>
                                            {
                                                formErrors.name ?
                                                    <span className='error'>{formErrors.name}</span> :
                                                    <span className='success'>{formValues.name}</span>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <th><BsXDiamond />  Duration </th>
                                        <td>
                                            {
                                                formErrors.duration ?
                                                    <span className='error'>{formErrors.duration}</span> :
                                                    <span className='success'>{formValues.duration}</span>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <th><BsXDiamond />  Difficulty </th>
                                        <td>
                                            {
                                                formErrors.difficulty ?
                                                    <span className='error'>{formErrors.difficulty}</span> :
                                                    <span className='success'>{formValues.difficulty}{difficultyLevel[formValues.difficulty]}</span>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <th><BsXDiamond />  Season </th>
                                        <td>
                                            {
                                                formErrors.season ?
                                                    <span className='error'>{formErrors.season}</span> :
                                                    <span className='success'>{formValues.season}</span>
                                            }
                                        </td>
                                    </tr>
                                </thead>
                            </table>
                        </div>

                    </form>
                </div>
                <div id='activities'>
                    <h1> <BsXDiamond /> tourist activity List</h1>
                    <div id='content-overflow'>
                        <table>
                            <thead>
                                <tr>
                                    <th><BsXDiamond /> Name</th>
                                    <th><BsXDiamond /> Difficulty</th>
                                    <th><BsXDiamond /> Duration</th>
                                    <th><BsXDiamond /> Season</th>
                                    <th><BsXDiamond /> Edit</th>
                                    <th><BsXDiamond /> Delt</th>
                                </tr>
                            </thead>
                            <tbody>{activities}</tbody>
                        </table>
                        {msg}
                    </div>
                </div>
            </section>
        </div>
    )
}

const mapStateToProps = (state) => ({ storeActivities: state.activities });
const mapDispatchToProps = (dispatch) => {
    return {
        dispatchCreateActivity:
            (activity) =>
                dispatch(createActivity({ activity })),
        dispatchRemoveActivity:
            (id) =>
                dispatch(removeActivity({ activityId: id })),
        dispatchUpdateActivity:
            (activity) =>
                dispatch(updateActivity({ activity }))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddActivityFormComponent);
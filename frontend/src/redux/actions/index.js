import CountriesService from "../services/countries.service";
import ActionTypes from "../action-types/index";

const defaulStatistics = [
    { title: 'Max Population', country: 'China', data: '1,439,323,776', tag: 1 },
    { title: 'Min Population', country: 'Vatican City', data: '801', tag: 1 },
    { title: 'Max Area KM2', country: 'Rusia', data: '16,376,870', tag: 2 },
    { title: 'Min Area KM', country: 'Vatican City', data: '0,44', tag: 2 }
];

export const setInitialState = () => {
    return async (dispatch) => {
        CountriesService.getInitialState()
        .then(payload => dispatch({
            type: ActionTypes.SET_INITIAL_STATE,
            payload: { ...payload, 'statistics': defaulStatistics }
        }))
        .catch(payload => dispatch({ type: ActionTypes.DEFAULT_TYPE, payload }));
        ;
    }
}

export const setStatistics = ({ statistics = defaulStatistics }) =>
    ({ type: ActionTypes.SET_ESTATISTICS, payload: statistics })

export const setInitialStateAsync_ = () => {
    return async (dispatch) => {
        const payload = await CountriesService.getInitialState();
        dispatch({ type: ActionTypes.SET_INITIAL_STATE, payload });
    }
}

export const setCountriesByContinent = ({ region, statistics = defaulStatistics }) => {
    if (!region.includes(' ')) {
        return ({ type: ActionTypes.SET_COUNTRIES_BY_CONTINENT, payload: { region, statistics } });
    } else {
        return ({ type: ActionTypes.SET_ALL_COUNTRIES, payload: {} });
    }
}

export const getCountriesWithoutActivity = ({ activityId }) => {
    if (Number(activityId) > 0)
        return ({ type: ActionTypes.SET_COUNTRIES_WITHOUT_ACTIVITY, payload: activityId });
}

export const _getCountriesWihtoutActivity2222222 = ({ activityName }) => {
    if (activityName.length > 0)
        return ({ type: ActionTypes.SET_COUNTRIES_WITHOUT_ACTIVITY, payload: activityName });
}


export const setCountriesByContinentAsync = ({ region }) => {
    return async (dispatch) => {
        const payload = await CountriesService.getCountriesByContinent({ region });
        dispatch({ type: ActionTypes.SET_COUNTRIES_BY_CONTINENT, payload });
    }
}

export const setAvtivities = () => {
    return async (dispatch) => {
        CountriesService.getAvtivities()
            .then(data => dispatch({ type: ActionTypes.SET_ACTIVITIES, payload: data }))
            .catch(({ name, message }) =>
                dispatch({ type: ActionTypes.DEFAULT_TYPE, payload: { name, message } }));
    }
}

export const setAvtivitiesAsync = () => {
    return async (dispatch) => {
        const payload = await CountriesService.getAvtivities();
        dispatch({ type: ActionTypes.SET_ACTIVITIES, payload });
    }
}

export const setCountryDetail = ({ code }) => {
    return async (dispatch) => {
        await CountriesService.getCountryDetail({ code })
            .then(payload => dispatch({ type: ActionTypes.SET_COUNTRY_DETAIL, payload }))
            .catch(({ name, message }) =>
                dispatch({ type: ActionTypes.DEFAULT_TYPE, payload: { name, message } }));
    }
}

export const setCountryDetailAsync = ({ code }) => {
    return async (dispatch) => {
        const payload = await CountriesService.getCountryDetail({ code });
        dispatch({ type: ActionTypes.SET_COUNTRY_DETAIL, payload });
    }
}

export const searchCountry = ({ countryName }) =>
    ({ type: ActionTypes.SEARCH_COUNTRY, payload: countryName });

export const searchCountryAsync = ({ countryName }) => {
    return async (dispatch) => {
        const payload = await CountriesService.searchCountry({ countryName });
        dispatch({ type: ActionTypes.SEARCH_COUNTRY, payload });
    }
}

export const createActivity = ({ activity }) => {
    return async (dispatch) => {
        CountriesService.createActivity({ activity })
            .then(payload => dispatch({ type: ActionTypes.CREATE_ACTIVITY, payload }))
            .catch(payload => dispatch({ type: ActionTypes.DEFAULT_TYPE, payload }));
    }
}

export const createActivityAsync = ({ activity }) => {
    return async (dispatch) => {
        const payload = await CountriesService.createActivity({ activity });
        dispatch({ type: ActionTypes.CREATE_ACTIVITY, payload });
    }
}

export const updateActivity = ({ activity }) => {
    return async (dispatch) => {
        CountriesService.updateActivity({ activity })
            .then(payload => dispatch({ type: ActionTypes.UPDATE_ACTIVITY, payload }))
            .catch(payload => dispatch({ type: ActionTypes.DEFAULT_TYPE, payload }))
    }
}

export const updateActivityAsync = ({ activity }) => {
    return async (dispatch) => {
        const payload = await CountriesService.updateActivity({ activity });
        dispatch({ type: ActionTypes.UPDATE_ACTIVITY, payload });
    }
}

export const removeActivity = ({ activityId }) => {
    return async (dispatch) => {
        CountriesService.removeActivity({ activityId })
            .then(payload => dispatch({ type: ActionTypes.REMOVE_ACTIVITY, payload }))
            .catch(payload => dispatch({ type: ActionTypes.DEFAULT_TYPE, payload }));
    }
}

export const removeActivityAsync = ({ activityId }) => {
    return async (dispatch) => {
        const payload = await CountriesService.removeActivity({ activityId });
        dispatch({ type: ActionTypes.REMOVE_ACTIVITY, payload });
    }
}

export const removeActivityFromCountry = ({ countryId, activityId }) => {
    return async (dispatch) => {
        const success = await CountriesService.removeActivityFromCountry({ countryId, activityId });
        console.log('success : ', success);
        if (success === 1)
            dispatch({ type: ActionTypes.REMOVE_ACTIVITY_FROM_COUNTRY, payload: activityId });
        else dispatch({ type: ActionTypes.DEFAULT_TYPE, payload: {} });
    }
}

export const setCountriesByActivity = ({ activityId }) => {
    return async (dispatch) => {
        CountriesService.getCountriesByActivity({ activityId })
            .then(payload => dispatch({ type: ActionTypes.SET_COUNTRIES_BY_ACTIVITY, payload }))
            .catch(payload => dispatch({ type: ActionTypes.SET_COUNTRIES_BY_ACTIVITY, payload }));
    }
}

export const setCountryActivities = ({ activities }) =>
    ({ type: ActionTypes.SET_COUNTRY_ACTIVITIES, payload: activities })

export const setCountryActivity = ({ activityId }) =>
    ({ type: ActionTypes.SET_COUNTRY_ACTIVITY, payload: activityId })

export const removeCountryActivity = ({ activityId }) =>
    ({ type: ActionTypes.REMOVE_COUNTRY_ACTIVITY, payload: activityId })

export const setCountriesByActivityAsync = ({ activityId }) => {
    return async (dispatch) => {
        const payload = await CountriesService.getCountriesByActivity({ activityId });
        dispatch({ type: ActionTypes.SET_COUNTRIES_BY_ACTIVITY, payload });
    }
}

export const addActivityToCountry = ({ countryId, activityId }) => {
    return (dispatch) => {
        CountriesService.addActivityToCountry({ countryId, activityId })
            .then(data => {
                if (objectLength(data))
                    dispatch({ type: ActionTypes.ADD_ACTIVITY_TO_COUNTRY, payload: data })
                else dispatch({ type: ActionTypes.DEFAULT_TYPE, payload: {} })
            })
            .catch(error => dispatch({ type: ActionTypes.DEFAULT_TYPE, payload: error }));
    }
}

export const addActivityToCountryAsync = ({ countryId, activityId }) => {
    return async (dispatch) => {
        const payload = await CountriesService.addActivityToCountry({ countryId, activityId });
        if (objectLength(payload)) {
            dispatch({ type: ActionTypes.ADD_ACTIVITY_TO_COUNTRY, payload });
        }
        dispatch({ type: ActionTypes.DEFAULT_TYPE, payload: {} });
    }
}

export const setActivityToCountries = ({ countryCode }) =>
    ({ type: ActionTypes.SET_ACTIVITY_TO_COUNTRIES, payload: countryCode });


export const savetActivityToCountries = ({ activityCountries }) => {
    return async (dispatch) => {
        CountriesService.addActivityToCountries({ activityCountries })
            .then((data) => dispatch({ type: ActionTypes.SAVE_ACTIVITY_TO_COUNTRIES, payload: data }))
            .catch(({ message, name }) => dispatch({ type: ActionTypes.DEFAULT_TYPE, payload:({ message, name }) }));
    }
}

export const savetActivityToCountriesAsync = ({ activityCountries }) => {
    return async (dispatch) => {
        await CountriesService.addActivityToCountries({ activityCountries });
        dispatch({ type: ActionTypes.SAVE_ACTIVITY_TO_COUNTRIES, payload: {} });
    }
}

export const sortCountries = (sort) => ({ type: ActionTypes.SORT_COUNTRIES, payload: sort });

export const filterByTourinstActivity = ({ activity }) => ({
    type: ActionTypes.FILTER_BY_TOURINST_ACTIVITY,
    payload: activity
})

export const setPagination = ({ page }) => {
    const limit = page * 16;
    const offset = limit - 16;
    return ({ type: ActionTypes.SET_PAGINATION, payload: { offset, limit } });
}

export const setAlert = ({ alert }) => {
    return ({ type: ActionTypes.SET_ALERT, payload: alert });
}

export const removeActivityFromActivityToCountries = ({ code }) => {
    return ({ type: ActionTypes.REMOVE_ACTIVITY_FROM_ACTIVITY_TO_COUNTRY, payload: code });
}

const objectLength = (object) => (Object.entries(object).length > 0 ? true : false);
// const arrayLength = (array) => (Array.isArray(array) && array.length > 0 ? true : false);
export const defaultAction = () => ({ type: ActionTypes.DEFAULT_TYPE, payload: {} });
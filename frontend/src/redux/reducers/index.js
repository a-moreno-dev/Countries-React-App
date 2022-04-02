import ActionTypes from "../action-types/index";

const initialAppState = {
    allCountries: [],
    countries: [],
    activities: [],
    activityToCountries: [],
    countriesWithoutActivities: [],
    country: {},
    countryActivities: [],
    activity: {},
    pagination: {
        offset: 0,
        limit: 16
    },
    sort: 'upNameComparator',
    statistics: [],
    message: {
        type: '',
        text: ''
    }
    // message: {
    //     type: 'alert-success',
    //     text: 'Data not found'
    // }
}

const countriesReducer = (state = initialAppState, { type, payload }) => {
    switch (type) {
        case ActionTypes.SET_INITIAL_STATE:
            const countries = getData(payload.countries);
            return {
                ...state,
                allCountries: countries,
                countries: countries,
                activities: getData(payload.activities),
                country: countries[0],
                countriesWithoutActivities: setCountriesWithoutActivities(countries)
            };
        case ActionTypes.SET_ALL_COUNTRIES:
            return { ...state, countries: state.allCountries };
        case ActionTypes.SET_COUNTRIES_WITHOUT_ACTIVITY:
            return { 
                ...state, 
                countriesWithoutActivities: getCountriesWithoutActivity(payload, state.allCountries) };
        case ActionTypes.SET_COUNTRIES_BY_CONTINENT:
            return {
                ...state, pagination: { offset: 0, limit: 16 }, country: {}, statistics: payload.statistics,
                countries: state.allCountries.filter(country => country.region === payload.region)
            };
        case ActionTypes.SEARCH_COUNTRY:
            return {
                ...state, country: {},
                countries: state.allCountries.filter(activity => activity.name.includes(payload)),
                pagination: { offset: 0, limit: 16 }
            };
        case ActionTypes.SET_COUNTRY_DETAIL:
            return { ...state, country: payload, countryActivities: payload.activities };
        case ActionTypes.SET_ACTIVITIES:
            return {
                ...state, activities: payload,
                countriesWithoutActivities: setCountriesWithoutActivities(state.countries)
            };
        case ActionTypes.SET_ACTIVITY_TO_COUNTRIES:
            state.activityToCountries.push(
                state.allCountries.find(
                    country => country.alpha3Code === payload));
            return {
                ...state,
                countriesWithoutActivities: state.countriesWithoutActivities.filter(
                    country => country.alpha3Code !== payload
                )
            };
        case ActionTypes.SAVE_ACTIVITY_TO_COUNTRIES: 
        return { ...state, allCountries: payload, activityToCountries: [] };
        case ActionTypes.CREATE_ACTIVITY: return { ...state, activities: getData(payload), country: {} };
        case ActionTypes.UPDATE_ACTIVITY:
            return {
                ...state, activities: payload, country: {},
                countriesWithoutActivities: setCountriesWithoutActivities(state.countries)
            };
        case ActionTypes.REMOVE_ACTIVITY:
            return {
                ...state, activities: payload, country: {},
                countriesWithoutActivities: setCountriesWithoutActivities(state.countries)
            };
        case ActionTypes.SET_COUNTRIES_BY_ACTIVITY:
            return {
                ...state,
                countries: payload.countries, activity: payload,
                pagination: { offset: 0, limit: 16 }
            };
        case ActionTypes.REMOVE_ACTIVITY_FROM_COUNTRY:
            return {
                ...state,
                countriesWithoutActivities: setCountriesWithoutActivities(state.countries),
                countryActivities: state.countryActivities.filter(
                    activity => activity.id !== payload
                )
            };
        case ActionTypes.SET_COUNTRY_ACTIVITIES:
            return { ...state, countryActivities: payload };
        case ActionTypes.SET_COUNTRY_ACTIVITY:
            return {
                ...state,
                countryActivities: state.activities.find(
                    activity => activity.id === payload
                )
            };
        case ActionTypes.REMOVE_COUNTRY_ACTIVITY:
            return {
                ...state,
                countryActivities: state.countryActivities.filter(
                    activity => activity.id !== payload
                )
            };
        case ActionTypes.ADD_ACTIVITY_TO_COUNTRY:
            return {
                ...state,
                countryActivities: [...state.countryActivities, payload],
                countriesWithoutActivities: setCountriesWithoutActivities(state.countries)
            };
        case ActionTypes.SORT_COUNTRIES: return { ...state, sort: payload };
        case ActionTypes.SET_PAGINATION:
            return { ...state, pagination: { offset: payload.offset, limit: payload.limit } };
        case ActionTypes.REMOVE_ACTIVITY_FROM_ACTIVITY_TO_COUNTRY:
            return {
                ...state,
                activityToCountries: state.activityToCountries.filter(
                    country => country.alpha3Code !== payload)
            };
        case ActionTypes.SET_ESTATISTICS:
            return { ...state, statistics: payload }
        default: return state;
    }
}

const setCountriesWithoutActivities = (countries) =>
    (countries.filter(country => country.activities.length === 0));

const getCountriesWithoutActivity = (activityId, allCountries) =>
(
    allCountries.filter(country =>
        ! country.activities.find(activity =>
            activity.id === activityId)
    )
);

const getData = (data) => ((Array.isArray(data) && data.length) ? data : []);

export default countriesReducer;
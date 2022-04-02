import axios from "axios";
import Country from "../country";

const httpCountriesService = {};
const messages = { '200': 'OK', '201': 'OBJECT_CREATED', '204': 'NO_CONTENT', '404': 'DATA_NOT_FOUND' };
const localServer = 'http://localhost:7600/';
const remoteServer = 'https://restcountries.com/v2/';

httpCountriesService.getInitialState = async () => {
    try {
        const countriesPrimise = axios.get(`${localServer}countries`);
        const activitiesPrimise = axios.get(`${localServer}activities`);
        const [countries, activities] = await axios.all([countriesPrimise, activitiesPrimise]);
        const countriesData = (countries.status === 200) ? countries.data : messages[countries.status];
        const activitiesData = (activities.status === 200) ? activities.data : messages[activities.status];
        return { countries: countriesData, activities: activitiesData };
    } catch ({ message, name }) { return ({ message, name }); }
}

httpCountriesService.getCountriesByContinent = async ({ region }) => {
    try {
        const countries = await axios.get(`${localServer}continent/${region}`);
        return ((countries.status === 200) ? countries.data : messages[countries.status]);
    } catch ({ message, name }) { return ({ message, name }); }
}

httpCountriesService.getCountryDetail = async ({ code }) => {
    try {
        const countryPromise = axios.get(`${remoteServer}alpha/${code}`);
        const activitiesPromise = axios.get(`${localServer}country-activities/${code}`);
        const [country, activities] = await axios.all([countryPromise, activitiesPromise]);
        const countryData = (country.status === 200) ? country.data : messages[country.status];
        const activitiesData = (activities.status === 200) ? activities.data.activities : messages[activities.status];
        let countryDetail = {};

        if (objectLength(countryData)) {
            countryDetail = new Country({ data: countryData });
            if (countryDetail.borders.length) {
                const borders = await axios.get(`${localServer}borders/${countryDetail.borders}`);
                if (borders.status === 200 && arrayLength(borders.data)) {
                    countryDetail.borders = borders.data;
                }
            }
            if (arrayLength(activitiesData)) {
                countryDetail.activities = activitiesData;
            }
        }
        return countryDetail;
    } catch ({ message, name }) { return ({ message, name }); }
}

httpCountriesService.searchCountry = async ({ countryName }) => {
    try {
        const country = await axios.get(`${localServer}countries?name=${countryName}`);
        if (country.status === 200 && arrayLength(country.data)) {
            return country.data.map(country => new Country({ data: country.data }))
        }
    } catch ({ message, name }) { return ({ message, name }); }
}

httpCountriesService.searchCountryAsync = async ({ countryName }) => {
    try {
        const country = await axios.get(`${localServer}countries?name=${countryName}`);
        return ((country.status === 200) ? country.data : messages[country.status]);
    } catch ({ message, name }) { return ({ message, name }); }
}

httpCountriesService.getCountriesByActivity = async ({ activityId }) => {
    try {
        const { data } = await axios.get(`${localServer}activity-countries/${activityId}`);
        return data;
    } catch ({ message, name }) { return ({ message, name }); }
}

httpCountriesService.getAvtivities = async () => {
    try {
        const { data } = await axios.get(`${localServer}activities`);
        return data;
    } catch ({ message, name }) { return ({ message, name }); }
}

httpCountriesService.createActivity = async ({ activity }) => {
    try {
        const activities = await axios.post(`${localServer}activity`, activity);
        return (activities.status === 201) ? activities.data : messages[activities.status];
    } catch ({ message, name }) { return ({ message, name }); }
}

httpCountriesService.updateActivity = async ({ activity }) => {
    try {
        const { data } = await axios.put(`${localServer}update-activity/${activity.id}`, activity);
        return data;
    } catch ({ message, name }) { return ({ message, name }); }
}

httpCountriesService.removeActivity = async ({ activityId }) => {
    try {
        const { data } = await axios.delete(`${localServer}remove-activity/${activityId}`);
        return data;
    } catch ({ message, name }) { return ({ message, name }); }
}

httpCountriesService.removeActivityFromCountry = async ({ countryId, activityId }) => {
    try {
        const { data } = await axios.delete(`${localServer}remove-activity-from-country/${countryId}/${activityId}`);
        return data;
    } catch ({ message, name }) { return ({ message, name }); }
}

httpCountriesService.addActivityToCountry = async ({ countryId, activityId }) => {
    try {
        const response = await axios.post(`${localServer}add-activity-to-country`, { countryId, activityId });
        if (response.status === 201 && objectLength(response.data)) return response.data;
        return messages[response.status]
    } catch ({ message, name }) { return ({ message, name }); }
}

httpCountriesService.addActivityToCountries = async ({ activityCountries }) => {
    try {
        const { data } = await axios.post(`${localServer}add-activity-to-countries`, { activityCountries });
        return data;
    } catch ({ message, name }) { return ({ message, name }); }
};

const objectLength = (object) => (Object.entries(object).length > 0 ? true : false);
const arrayLength = (array) => (Array.isArray(array) && array.length > 0 ? true : false);

export default httpCountriesService;
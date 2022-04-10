import axios from "axios";
import Country from "../country";

const httpService = {};
const messages = { '200': 'OK', '201': 'OBJECT_CREATED', '204': 'NO_CONTENT', '404': 'DATA_NOT_FOUND' };
const localServer = 'http://localhost:7600/';
const remoteServer = 'https://restcountries.com/v2/';

httpService.getInitialState = async () => {
    try {
        const [_countries, _activities] = await Promise.allSettled([
            axios.get(`${localServer}countries`),
            axios.get(`${localServer}activities`)
        ])
        return {
            countries: _countries.value.data,
            activities: _activities.value.data
        };
    } catch ({ message, name }) { return ({ message, name }); }
}

httpService.getCountriesByContinent = async ({ region }) => {
    axios.get(`${localServer}/${region}`)
        .then(countries => countries.data)
        .catch(error => error);
}

httpService.getCountryDetail = async ({ code }) => {
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

httpService.searchCountry = async ({ countryName }) => {
    axios.get(`${localServer}countries?name=${countryName}`)
        .then(country => country.data.map(country => new Country({ data: country.data })))
        .catch(({ message, name }) => ({ message, name }));
}

httpService.getCountriesByActivity = async ({ activityId }) => {
    axios.get(`${localServer}activity-countries/${activityId}`)
        .then(activity => activity.data)
        .catch(({ message, name }) => ({ message, name }));
}

httpService.getAvtivities = async () => {
    axios.get(`${localServer}activities`)
        .then(activities => activities.data)
        .catch(({ message, name }) => ({ message, name }));
}

httpService.createActivity = async ({ activity }) => {
    axios.post(`${localServer}activity`, activity)
        .then(activities => activities.data)
        .catch(({ message, name }) => ({ message, name }));
}

httpService.updateActivity = async ({ activity }) => {
    axios.put(`${localServer}update-activity/${activity.id}`, activity)
        .then(activities => activities.data)
        .catch(({ message, name }) => ({ message, name }));
}

httpService.removeActivity = async ({ activityId }) => {
    axios.delete(`${localServer}remove-activity/${activityId}`)
        .then(activities => activities.data)
        .catch(({ message, name }) => ({ message, name }));
}

httpService.removeActivityFromCountry = async ({ countryId, activityId }) => {
    axios.delete(`${localServer}remove-activity-from-country/${countryId}/${activityId}`)
        .then(activities => activities.data)
        .catch(({ message, name }) => ({ message, name }));
}

httpService.addActivityToCountry = async ({ countryId, activityId }) => {
    axios.post(`${localServer}add-activity-to-country`, { countryId, activityId })
        .then(activity => activity.data)
        .catch(({ message, name }) => ({ message, name }));
}

httpService.addActivityToCountries = async ({ activityCountries }) => {
    axios.post(`${localServer}add-activity-to-countries`, { activityCountries })
        .then(activities => activities.data)
        .catch(({ message, name }) => ({ message, name }));
};

const objectLength = (object) => (Object.entries(object).length > 0 ? true : false);
const arrayLength = (array) => (Array.isArray(array) && array.length > 0 ? true : false);

export default httpService;
const router = require('express').Router();
// const { body } = require('express-validator');
const CountriesController = require('./CountriesController');
const {
    CountryModel,
    ActivityModel,
    CountriesActivitiesModel
} = require('../models/models');

router.get('/', CountriesController.setCountriesToDB);
router.get('/countries', CountriesController.getAllCountries);
router.get('/continent/:region', CountriesController.getCountriesByContinent);
router.get('/countries/:idPais', CountriesController.getCountryById);
router.get('/borders/:countryCodes', CountriesController.getCountryBorders);
router.get('/activity-countries/:activityId', CountriesController.getCountriesByActivity);
router.get('/country-activities/:code', CountriesController.geActivitiestByCountry);
router.post('/add-activity-to-country', CountriesController.addActivityToCountry);
router.delete('/remove-activity-from-country/:countryId/:activityId', CountriesController.removeActivityFromCountry);

router.get('/activity-to-countries', CountriesController.getActivityToCountries);
// router.post('/activity-to-countries',        CountriesController.setActivityToCountries);
router.post('/add-activity-to-countries', CountriesController.addActivityToCountries);
router.get('/activities', CountriesController.getAllActivities);
router.post('/activity', CountriesController.createActivity);
router.put('/update-activity/:id', CountriesController.updateActivity);
router.delete('/remove-activity/:activityId', CountriesController.removeActivity);

router.get('/full-activities', async (req, res) => {
    CountryModel.findAll({ attributes: ['alpha3Code'] })
        .then(countries => {
            ActivityModel.findAll({ attributes: ['id'] })
                .then(acivities => {
                    let cams = [];
                    for(let cam in countries) {
                        cams.push(acivities.map(activity => ({ 'alpha3Code': countries[cam].alpha3Code, 'activity_id': activity.id })))
                    }
                    for(let c of cams) {
                        CountriesActivitiesModel.bulkCreate(c);
                        setTimeout(() => null, 1000)
                    }
                    res.status(200).json(cams);
                })
                .catch(error => res.status(200).json(error))
        })
        .catch(error => res.status(200).json(error))
});

module.exports = router;
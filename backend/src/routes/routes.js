const router = require('express').Router();
const MainController = require('./MainController');

// router.get('/', MainController.setCountriesToDB);
router.get('/countries', MainController.getAllCountries);
router.get('/continent/:region', MainController.getCountriesByContinent);
router.get('/countries/:idPais', MainController.getCountryById);
router.get('/borders/:countryCodes', MainController.getCountryBorders);
router.get('/activity-countries/:activityId', MainController.getCountriesByActivity);
router.get('/country-activities/:code', MainController.geActivitiestByCountry);
router.post('/add-activity-to-country', MainController.addActivityToCountry);
router.delete('/remove-activity-from-country/:countryId/:activityId', MainController.removeActivityFromCountry);

router.get('/activity-to-countries', MainController.getActivityToCountries);
router.post('/add-activity-to-countries', MainController.addActivityToCountries);
router.get('/activities', MainController.getAllActivities);
router.post('/activity', MainController.createActivity);
router.put('/update-activity/:id', MainController.updateActivity);
router.delete('/remove-activity/:activityId', MainController.removeActivity);

module.exports = router;
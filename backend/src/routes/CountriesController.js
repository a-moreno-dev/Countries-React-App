const {
    CountryModel,
    ActivityModel,
    CountriesActivitiesModel
} = require('../models/models');
const { Op, Sequelize, EmptyResultError } = require('sequelize');
const axios = require('axios');
const Country = require('./country');

const CountriesController = {}

CountriesController.setCountriesToDB = async (req, res) => {
    const { data } = await axios.get('https://restcountries.com/v2/all');
    const apiCountries = data.map(country => (new Country(country)))
    const countries = await CountryModel.bulkCreate(apiCountries);
    res.status(200).json(countries);
}

CountriesController.getAllCountries = async (req, res, netx) => {
    const { name } = req.query;
    let _countries = [];
    if (name && name.length > 0) {
        axios.get(`https://restcountries.com/v2/name/${name.toLowerCase()}`)
            .then(countries => {
                _countries = countries.map(country => (new Country(country)))
                res.status(200).json(_countries);
            })
            .catch(error => res.status(200).json(error));
    } else {
        CountryModel.findAll({
            order: ['name'],
            include: {
                model: ActivityModel,
                order: ['name'],
            }
        })
            .then(countries => {
                if (countries.length === 0)
                    return res.status(204).json({ msj: 'COUNTRIES_NOT_FOUND' });
                res.status(200).json(countries);
            })
            .catch(error => res.status(404).json(error));
    }
}

CountriesController.getAllCountriesAsync = async (req, res, netx) => {
    const { name } = req.query;
    let countries = [];
    try {
        if (name && name.length > 0) {
            const { data } = await axios.get(`https://restcountries.com/v2/name/${name.toLowerCase()}`);
            countries = data.map(country => (new Country(country)))
        } else {
            countries = await CountryModel.findAll({
                order: ['name'],
                include: {
                    model: ActivityModel,
                    order: ['name'],
                }
            });
        }
        if (Array.isArray(countries) && countries.length) {
            res.status(200).json(countries);
        } else {
            res.status(204).json({ message: 'countries not found' });
        }
    } catch ({ message, name }) {
        res.status(404).json({ message, name });
    }
}

CountriesController.getAllActivities = async (req, res) => {
    try {
        const activities = await ActivityModel.findAll({
            order: [['name', 'ASC']]
        });
        if (activities.length === 0)
            return res.status(204).json({ msj: 'COUNTRIES_NOT_FOUND' });
        res.status(200).json(activities);
    } catch ({ message, name }) {
        res.status(404).json({ message, name });
    }
}


CountriesController.getCountryBorders = async (req, res) => {
    const countryCodes = req.params.countryCodes.trim().split(',');
    try {
        const borders = await CountryModel.findAll({
            where: { alpha3Code: { [Op.in]: countryCodes } },
            order: [['name', 'ASC']]
        });
        if (borders.length === 0)
            return res.status(204).json({ msj: 'COUNTRIES_NOT_FOUND' });
        res.status(200).json(borders);
    } catch ({ message, name }) {
        res.status(404).json({ message, name });
    }
}

CountriesController.getActivityToCountries = async (req, res) => {
    try {
        const countries = await CountryModel.findAll({
            attributes: ['alpha3Code', 'name'],
            order: ['name', 'ASC'],
            include: {
                model: ActivityModel,
                attributes: ['id', 'name'],
                order: ['name', 'ASC'],
            }
        });
        if (countries.length === 0)
            return res.status(204).json({ msj: 'COUNTRIES_NOT_FOUND' });
        res.status(200).json(countries);
    } catch ({ message, name }) {
        res.status(404).json({ message, name });
    }
}

CountriesController.setActivityToCountries = async (req, res, netx) => {
    const { offset, limit } = req.params;
    try {
        const countries = await CountryModel.findAll({
            offset: offset,
            limit: limit,
            include: {
                model: ActivityModel
            }
        });
        if (countries.length === 0)
            return res.status(204).json({ msj: 'COUNTRIES_NOT_FOUND' });
        res.status(200).json(countries);
    } catch ({ message, name }) {
        res.status(404).json({ message, name });
    }
}

CountriesController.getCountriesByContinent = async (req, res) => {
    try {
        const countries = await CountryModel.findAll(
            {
                where: { region: req.params.region },
                order: [['name', 'ASC']],
            }
        );
        if (countries.length === 0)
            return res.status(204).json({ msj: 'COUNTRIES_NOT_FOUND' });
        res.status(200).json(countries);
    } catch ({ message, name }) {
        res.status(404).json({ message, name });
    }

}

CountriesController.getCountryById = async (req, res) => {
    const { idPais } = req.params;
    try {
        const countries = await CountryModel.findAll({
            where: { alpha3Code: idPais.toLowerCase() },
            include: { model: ActivityModel }
        });
        if (countries.length === 0)
            return res.status(204).json({ msj: 'COUNTRIES_NOT_FOUND' });
        res.status(200).json(countries);
    } catch ({ message, name }) {
        res.status(404).json({ message, name });
    }
}

CountriesController.getCountriesByActivity = async (req, res) => {
    const { activityId } = req.params;
    try {
        const countries = await ActivityModel.findOne({
            where: { id: activityId },
            include: {
                model: CountryModel,
                order: [['name', 'ASC']],
                through: {
                    attributes: {
                        exclude: ['id', 'alpha3Code', 'activity_id']
                    }
                }
            },
        });
        if (countries.length === 0)
            return res.status(204).json({ msj: 'COUNTRIES_NOT_FOUND' });
        res.status(200).json(countries);
    } catch ({ message, name }) {
        res.status(404).json({ message, name });
    }
}

// Activities Methods

CountriesController.createActivity = async (req, res) => {
    try {
        const { name, difficulty, duration, season } = req.body;
        const success = await ActivityModel.create(
            { name, difficulty, duration, season }
        );
        if (success && success.id > 0) {
            try {
                const activities = await ActivityModel.findAll({
                    order: [['name', 'ASC']]
                });
                res.status(201).json(activities);
            } catch (error) {
                res.status(404).json({ msg: 'Activity not fount' });
            }
        }
        else { res.status(201).json(success) };
    } catch ({ message, name }) {
        res.status(404).json({ message, name });
    }
}

CountriesController.updateActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, difficulty, duration, season } = req.body;
        const success = await ActivityModel.update(
            { name, difficulty, duration, season },
            { where: { id: id } }
        );
        if (success[0] === 1) {
            try {
                const activities = await ActivityModel.findAll({
                    order: [['name', 'ASC']]
                });
                res.status(201).json(activities);
            } catch ({ message, name }) {
                res.status(404).json({ message, name });
            }
        }
        else { res.status(201).json(success) };
    } catch ({ message, name }) {
        res.status(404).json({ message, name });
    }
}

CountriesController.removeActivity = async (req, res) => {
    const { activityId } = req.params;
    try {
        const success = await ActivityModel.destroy({
            where: { id: activityId }
        })
        if (success === 1) {
            try {
                const activities = await ActivityModel.findAll({
                    order: [['name', 'ASC']]
                });
                res.status(201).json(activities);
            } catch ({ message, name }) {
                res.status(404).json({ message, name });
            }
        }
        else { res.status(201).json(success) };
    } catch ({ message, name }) {
        res.status(404).json({ message, name });
    }
}

CountriesController.geActivitiestByCountry = async (req, res) => {
    const { code } = req.params;
    try {
        const countries = await CountryModel.findOne({
            where: { alpha3Code: code },
            attributes: ['alpha3Code'],
            include: {
                model: ActivityModel,
                order: ['name', 'ASC'],
                through: {
                    attributes: {
                        exclude: ['id', 'alpha3Code', 'activity_id']
                    }
                }
            },
        });
        res.status(200).json(countries);
    } catch ({ message, name }) {
        res.status(404).json({ message, name });
    }
}

CountriesController.removeActivityFromCountry = async (req, res) => {
    const { countryId, activityId } = req.params;
    try {
        const success = await CountriesActivitiesModel.destroy({
            where: { alpha3Code: countryId, activity_id: activityId }
        })
        res.status(201).json(success);
    } catch ({ message, name }) {
        res.status(404).json({ message, name });
    }
}

// ADD ACTIVITY TO COUNTRY
CountriesController.addActivityToCountry = async (req, res) => {
    const { countryId, activityId } = req.body;
    try {
        const success = await CountriesActivitiesModel.create(
            { alpha3Code: countryId, activity_id: activityId }
        );
        if (Object.entries(success).length > 0) {
            const activity = await ActivityModel.findByPk(activityId);
            res.status(201).json(activity);
        } else {
            res.status(204).json({ msg: 'activity not found' });
        }
    } catch ({ message, name }) {
        res.status(404).json({ message, name });
    }
}

// CountriesController.addActivityToCountry = async (req, res) => {
//     const { countryId, activityId } = req.body;
//     try {
//         const countryActivity = await CountriesActivitiesModel.create(
//             { alpha3Code: countryId, activity_id: activityId });

//         res.status(201).json(countryActivity);
//     } catch ({ message, name }) {
//         res.status(404).json({ message, name });
//     }
// }

CountriesController.addActivityToCountries = (req, res) => {
    const { activityCountries } = req.body;
    CountriesActivitiesModel.bulkCreate(activityCountries)
        .then(() => {
            CountryModel.findAll({
                order: ['name'],
                include: {
                    model: ActivityModel,
                    order: ['name'],
                }
            })
                .then(countries => {
                    if (countries.length === 0)
                        return res.status(204).json({ msj: 'COUNTRIES_NOT_FOUND' });
                    res.status(200).json(countries);
                })
                .catch(error => res.status(404).json(error))
        })
        .catch(({ message, name }) => res.status(404).json({ message, name }));
}

CountriesController.addActivityToCountries0000000 = async (req, res) => {
    const { activityCountries } = req.body;
    try {
        const success = await CountriesActivitiesModel.bulkCreate(activityCountries);
        if (success.length > 0) { }
        res.status(201).json(success);
    } catch ({ message, name }) {
        res.status(404).json({ message, name });
    }
}

module.exports = CountriesController;
const {
    CountryModel,
    ActivityModel,
    CountriesActivitiesModel
} = require('../models/models');
const { Op, Sequelize, EmptyResultError } = require('sequelize');
const axios = require('axios');
const Country = require('./country');
const remoteApiDomain = 'https://restcountries.com/v2';

const MainController = {}
const validateString = (str) => str.trim().replace(/[^a-z0-9]+/gi, "") ? true : false;
const filterString = (str) => str.trim().replace(/[^a-z0-9]+/gi, "");

// MainController.setCountriesToDB = async (req, res) => {
//     // const { data } = await axios.get('https://restcountries.com/v2/all');
//     const { data } = await axios.get(`${remoteApiDomain}/all`);
//     const apiCountries = data.map(country => (new Country(country)))
//     const countries = await CountryModel.bulkCreate(apiCountries);
//     res.status(200).json(countries);
// }

const findAllCountries = (res) => {
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
        .catch(({ message, name }) => res.status(404).json({ message, name }));
}

MainController.getAllCountries = async (req, res) => {
    const { name } = req.query;
    if (name) {
        if (validateString(name)) {
            const _name = filterString(name);
            axios.get(`${remoteApiDomain}/name/${_name.toLowerCase()}`)
                .then(countries => {
                    let _countries = [];
                    _countries = countries.map(country => (new Country(country)))
                    res.status(200).json(_countries);
                })
                .catch(({ message, name }) => res.status(200).json({ message, name }));
        } else {
            findAllCountries(res);
        }
    } else {
        findAllCountries(res);
    }
}

MainController.getAllActivities = async (req, res) => {
        ActivityModel.findAll({
            order: [['name', 'ASC']]
        })
        .then(activities => res.status(200).json(activities))
        .catch(({ message, name }) => res.status(204).json({ message, name }));
}

MainController.getCountryBorders = async (req, res) => {
    const countryCodes = req.params.countryCodes.trim().split(',');
    try {
        if (countryCodes.length > 0) {
            const _countryCodes = countryCodes.map(code => filterString(code));
            const borders = await CountryModel.findAll({
                where: { alpha3Code: { [Op.in]: _countryCodes } },
                order: [['name', 'ASC']]
            });
            if (!borders && borders.length === 0)
                return res.status(204).json({ msj: 'COUNTRIES_NOT_FOUND' });
            res.status(200).json(borders);
        }
    } catch ({ message, name }) {
        res.status(404).json({ message, name });
    }
}

MainController.getActivityToCountries = async (req, res) => {
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

MainController.setActivityToCountries = async (req, res) => {
    const { offset, limit } = req.params;
    try {
        const _offset = Number(offset);
        const _limit = Number(limit);
        const countries = await CountryModel.findAll({
            offset: _offset,
            limit: _limit,
            include: {
                model: ActivityModel
            }
        });
        if (!countries && countries.length === 0)
            return res.status(204).json({ msj: 'COUNTRIES_NOT_FOUND' });
        res.status(200).json(countries);
    } catch ({ message, name }) {
        res.status(404).json({ message, name });
    }
}

MainController.getCountriesByContinent = async (req, res) => {
    const { region } = req.params;
    try {
        if (validateString(region)) {
            const _region = filterString(region);
            const countries = await CountryModel.findAll(
                {
                    where: { region: _region },
                    order: [['name', 'ASC']],
                }
            );
            if (countries.length === 0)
                return res.status(204).json({ msj: 'COUNTRIES_NOT_FOUND' });
            res.status(200).json(countries);
        }
        return res.status(204).json({ msj: 'COUNTRIES_NOT_FOUND' });
    } catch ({ message, name }) {
        res.status(404).json({ message, name });
    }

}

MainController.getCountryById = async (req, res) => {
    const { idPais } = req.params;
    try {
        if (validateString(idPais)) {
            const _idPais = filterString(idPais);
            const countries = await CountryModel.findAll({
                where: { alpha3Code: _idPais.toLowerCase() },
                include: { model: ActivityModel }
            });
            if (countries.length === 0)
                return res.status(204).json({ msj: 'COUNTRIES_NOT_FOUND' });
            res.status(200).json(countries);
        }
        return res.status(204).json({ msj: 'COUNTRIES_NOT_FOUND' });
    } catch ({ message, name }) {
        res.status(404).json({ message, name });
    }
}

MainController.getCountriesByActivity = async (req, res) => {
    const { activityId } = req.params;
    try {
        const _activityId = Number(activityId);
        const countries = await ActivityModel.findOne({
            where: { id: _activityId },
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

MainController.createActivity = async (req, res) => {
    try {
        if (
            validateString(req.body.name) &&
            validateString(req.body.season) &&
            (new RegExp(/[0-9]{2}:[0-9]{2}:[0-9]{2}/g).test(req.body.duration)) &&
            (!isNaN(req.body.difficulty))
        ) {
            const name = filterString(req.body.name);
            const season = filterString(req.body.season);
            const { difficulty, duration } = req.body;

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
        }
        else { res.status(201).json([]) };
    } catch ({ message, name }) {
        res.status(404).json({ message, name });
    }
}

MainController.updateActivity = async (req, res) => {
    try {
        if (

            validateString(req.body.name) &&
            validateString(req.body.season) &&
            (new RegExp(/[0-9]{2}:[0-9]{2}:[0-9]{2}/g).test(req.body.duration)) &&
            (!isNaN(req.body.difficulty)) &&
            (!isNaN(req.params.id))
        ) {
            const name = filterString(req.body.name);
            const season = filterString(req.body.season);
            const { difficulty, duration } = req.body;

            const success = await ActivityModel.update(
                { name, difficulty, duration, season },
                { where: { id: req.params.id } }
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
        }
        else { res.status(200).json([]) };
    } catch ({ message, name }) {
        res.status(404).json({ message, name });
    }
}


MainController.removeActivity = async (req, res) => {
    const { activityId } = req.params;
    if (!isNaN(activityId) && Number(activityId) > 0) {
        ActivityModel.destroy({
            where: { id: activityId }
        })
            .then(success => {
                try {
                    ActivityModel.findAll({ order: [['name', 'ASC']] })
                        .then(activities => res.status(201).json(activities))
                        .catch(error => res.status(204).json([]));
                } catch ({ message, name }) {
                    return res.status(404).json({ message, name });
                }
            })
            .catch(error => res.status(404).json(error));
    } else {
        return res.status(404).json(error);
    }
}

MainController.geActivitiestByCountry = async (req, res) => {
    const { code } = req.params;
    if (validateString(code))
        CountryModel.findOne({
            where: { alpha3Code: filterString(code) },
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
        })
            .then(countries => res.status(200).json(countries))
            .catch(({ message, name }) => res.status(404).json({ message, name }));
}

MainController.removeActivityFromCountry = async (req, res) => {
    const { countryId, activityId } = req.params;
    CountriesActivitiesModel.destroy({
        where: { alpha3Code: countryId, activity_id: activityId }
    })
        .then(success => res.status(201).json(success))
        .catch(({ message, name }) => res.status(404).json({ message, name }));
}

// ADD ACTIVITY TO COUNTRY
MainController.addActivityToCountry = async (req, res) => {
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

MainController.addActivityToCountries = (req, res) => {
    const { activityCountries } = req.body;
    if (Array.isArray(activityCountries) && activityCountries.length > 0) {
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
    }else {
        return res.status(404).json(error);
    }

}

module.exports = MainController;
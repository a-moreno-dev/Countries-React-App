const { Sequelize, DataTypes } = require('sequelize');
const { parsed: DB_CONFIG } = require('dotenv').config();

const SequelizeManager = {};

SequelizeManager.config = new Sequelize(
    DB_CONFIG.DB_SCHEMA,
    DB_CONFIG.DB_USERNAME,
    DB_CONFIG.DB_PASSWORD,
    {
        host: DB_CONFIG.SERVER_ADDRESS,
        port: DB_CONFIG.SERVER_PORT,
        dialect: DB_CONFIG.DB_DIALECT,
        logging: false,
        define: {
            timestamps: true
        },
    }
);

SequelizeManager.CountryModel = SequelizeManager.config.define('countries', {
    alpha3Code: { type: DataTypes.STRING(3), primaryKey: true, allowNull: false },
    name:       { type: DataTypes.STRING(65), allowNull: false },
    flag:       { type: DataTypes.STRING, allowNull: false },
    region:     { type: DataTypes.STRING(50), allowNull: false },
    capital:    { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'N/A' },
    subregion:  { type: DataTypes.STRING(50), allowNull: true, defaultValue: 'N/A' },
    area:       { type: DataTypes.DOUBLE, allowNull: true, defaultValue: 0 },
    population: { type: DataTypes.DOUBLE, allowNull: true, defaultValue: 0 },
},{ timestamps: false });

SequelizeManager.ActivityModel = SequelizeManager.config.define('activities', {
    id:         { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    name:       { type: DataTypes.STRING(65), allowNull: false },
    difficulty: { type: DataTypes.INTEGER, allowNull: false },
    duration:   { type: DataTypes.TIME, allowNull: false },
    season:     { type: DataTypes.STRING(12), allowNull: false, }
},{ timestamps: false });

SequelizeManager.CountriesActivitiesModel = SequelizeManager.config.define('countries_activities', {
    id:         { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    alpha3Code: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
    activity_id:{ type: DataTypes.INTEGER, primaryKey: true, allowNull: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
},{ timestamps: false });

const { CountryModel, ActivityModel, CountriesActivitiesModel } = SequelizeManager;

ActivityModel.belongsToMany(CountryModel, { through: CountriesActivitiesModel, foreignKey: 'activity_id' });
CountryModel.belongsToMany(ActivityModel, { through: CountriesActivitiesModel, foreignKey: 'alpha3Code' });

module.exports = SequelizeManager;
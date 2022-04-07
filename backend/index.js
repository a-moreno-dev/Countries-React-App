const express = require('express');
const App = express();
var cors = require('cors')
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { config } = require('./src/models/models');
const routes = require('./src/routes/routes');
// const SequelizeManager = require('./src/models/models');

App.use(express.json());
App.use(cors());
App.use(bodyParser.urlencoded({ extended: true }));
App.use(morgan('dev'));
App.use('/', routes);
const EXPRESS_PORT = 7600;

// config.sync({ force: true })
//     .then(_ => {
//         App.listen(EXPRESS_PORT, _ => console.log('==== EXPRESS START SUCCESS ===='));
//         console.log('==== DB CONNECTION SUCCESS ====');
//     })
//     .catch(error => console.log('===== DB CONNECTION ERROR =====\n', error));

config.authenticate()
.then(_ => {
    App.listen(EXPRESS_PORT, _ => {
        console.log('==== EXPRESS START SUCCESS ====');
            console.log(`==== EXPRESS PORT ${EXPRESS_PORT} ========`);
        });
        console.log('==== DB CONNECTION SUCCESS ====');
    })
    .catch(error => console.log('===== DB CONNECTION ERROR =====\n', error));
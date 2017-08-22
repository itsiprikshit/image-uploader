/* Require modules */
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const compression = require('compression');
const Config = require('./config');

const ENV = process.env.NODE_ENV || 'development';

const config = Config(ENV);
const app = express();
const router = express.Router();

/* Express app settings - BEGIN */
app.enable('trust proxy');
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'client')));
/* Express app settings - END */

/* Require server routes */
require('./server')(app, router);

/* Server initialization */
const server = app.listen(config.SERVER.PORT, () => {
    console.log(`${new Date()} \nExpress HTTP ${ENV} server listening on port: ${config.SERVER.PORT}`);
});

module.exports = server;

// endpoint that gives process information

const router = require('express').Router();
const process = require('process');
const {processInfo} = require('../utils/process.utils');
const {loggerWarnings,loggerErrors ,loggerDefault } = require('../utils/loggers');
const { showInfo } = require('../controllers/info.controller');


router.get('/',showInfo);

module.exports = router;
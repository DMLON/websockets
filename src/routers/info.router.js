
// endpoint that gives process information

const router = require('express').Router();
const { showInfo } = require('../controllers/info.controller');


router.get('/',showInfo);

module.exports = router;
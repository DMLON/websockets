
// endpoint that gives process information

const router = require('express').Router();
const process = require('process');
const {processInfo} = require('../utils/process.utils');
const {loggerWarnings,loggerErrors ,loggerDefault } = require('../utils/loggers');


router.get('/', (req, res) => {
    const ip = req.clientIp;
    loggerDefault.info(`[${ip}] - GET /info`);
    //Convert to readable text
    const info={
        "Arguments" : processInfo.commandLineArgs,
        "PID" : processInfo.processId,
        "Execution Path": processInfo.nodePath,
        "OS": processInfo.OS,
        "Node Version": processInfo.nodeVersion,
        "Current Working Directory": processInfo.projectPath,
        "Current total Memory (MB)": Math.round(processInfo.RSSMemory/1024/1024),
        "Number of CPUs":processInfo.numCPUs
    }
    // console.log(info);
    res.render("info.pug",{info});
});

module.exports = router;

// endpoint that gives process information

const router = require('express').Router();
const process = require('process');
const {processInfo} = require('../utils/process.utils');


router.get('/', (req, res) => {
    //Convert to readable text
    const info={
        "Arguments" : processInfo.commandLineArgs,
        "PID" : processInfo.processId,
        "Execution Path": processInfo.nodePath,
        "OS": processInfo.OS,
        "Node Version": processInfo.nodeVersion,
        "Current Working Directory": processInfo.projectPath,
        "Current total Memory (MB)": Math.round(processInfo.RSSMemory/1024/1024),
    }
    res.render("info.pug",{info});
});

module.exports = router;
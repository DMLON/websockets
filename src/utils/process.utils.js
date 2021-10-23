const { argv, platform, version, memoryUsage, execPath, cwd, pid } = require("process");

const cliArgs = argv.slice(2).join(" ").toString();

module.exports = { 
    processInfo:{
        commandLineArgs: cliArgs,
        OS: platform,
        nodeVersion: version,
        RSSMemory: memoryUsage().rss,
        nodePath: execPath,
        projectPath: cwd(),
        processId: pid,
    }
}

const log4js =          require("log4js");

//log warnings in a file and info in another file
log4js.configure({
    appenders: {
        warnings_file: {
            type: 'file',
            filename: 'logs/warnings.log'
            // maxLevel: 'WARN' Not working
        },
        errors_file: {
            type: 'file',
            filename: 'logs/error.log'
        },
        console:{
            type: 'console',
        }
    },
    categories: {
        warnings: {
            appenders: ['warnings_file','console'],
            level: 'warn'
        },
        errors: {
            appenders: ['errors_file','console'],
            level: 'error'
        },
        default:{
            appenders: ['console'],
            level: 'info'
        }
    }
});


const loggerWarnings = log4js.getLogger('warnings');
const loggerErrors = log4js.getLogger('errors');
const loggerDefault = log4js.getLogger('default');

module.exports = {
    loggerWarnings,
    loggerErrors ,
    loggerDefault 
};
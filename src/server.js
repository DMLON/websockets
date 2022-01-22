const app = require("./server.init");
const config = require('./config.js');
const {loggerWarnings,loggerErrors ,loggerDefault } = require('./utils/loggers');

const PORT = config.PORT;
app.listen(PORT, (err) => {
    if (err){ loggerErrors.error(`Error creating server ${err}`); return;}
    loggerDefault.info(`Server started on ${PORT}`);
});

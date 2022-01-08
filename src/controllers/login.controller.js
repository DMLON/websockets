const {loggerWarnings,loggerErrors ,loggerDefault } = require('../utils/loggers');



const logout = (req, res) => {
    const ip = req.clientIp;
    loggerDefault.info(`[${ip}] - POST /auth/logout`);
    req.session.destroy((err) => {
        let result = null;
        if (!err) result = { error: false, status: "ok", redirectURL: "/products" };
        else result = { error: true, status: err };
        res.send(result);
    });
}

module.exports = {
    logout
}
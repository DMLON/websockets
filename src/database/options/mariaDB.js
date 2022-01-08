const config = require('../../config');

const options = {
    client: 'mysql',
    connection: config.connection,
    useNullAsDefault: true
}

module.exports = {
    options
}
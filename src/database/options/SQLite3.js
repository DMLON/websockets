const config = require('../../config');


const options = {
    client: 'sqlite3',
    connection: config.connection,
    useNullAsDefault: true
}

module.exports = {
    options
}
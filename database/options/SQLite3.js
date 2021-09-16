const options = {
    client: 'sqlite3',
    connection: {
        filename: "./database/ecommerce.sqlite"
    },
    useNullAsDefault: true
}

module.exports = {
    options
}
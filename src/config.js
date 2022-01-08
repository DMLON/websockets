
function setup(){
    const dotenv = require("dotenv");
    dotenv.config();

    const argv = require('minimist')(process.argv.slice(2));

    const { MONGODB_URI, SECRET, MYSQL_HOST, MYSQL_USER,MYSQL_PASSWORD,MYSQL_DATABASE, PERSISTENCE, SQLITE_FILEPATH ,FACEBOOK_APP_SECRET, FACEBOOK_APP_ID} = process.env;

    const NODE_ENV = argv.env || process.env.NODE_ENV || 'development';
    const PORT = process.env.PORT || argv.port || 8080;
    if (MONGODB_URI == undefined || SECRET == undefined || PERSISTENCE == undefined) {
        console.log("Please set the environment variables MONDODB_URI, SECRET, PERSISTENCE");
        process.exit(1);
    }
    let connection = null;

    if(PERSISTENCE == "SQLITE")
        connection =  {
            filename: SQLITE_FILEPATH || "./src/database/ecommerce.sqlite"
        }
    if(PERSISTENCE == "MYSQL")
        connection =  {
            host: MYSQL_HOST || "127.0.0.1",
            user: MYSQL_USER || "root",
            password: MYSQL_PASSWORD || "",
            database: MYSQL_DATABASE || "websockets"
        }
    
    
    return { MONGODB_URI, SECRET, NODE_ENV, PORT, connection ,FACEBOOK_APP_SECRET, FACEBOOK_APP_ID};
}

const { MONGODB_URI, SECRET, NODE_ENV, PORT, connection ,FACEBOOK_APP_SECRET, FACEBOOK_APP_ID} = setup();

module.exports={
    MONGODB_URI,
    SECRET,
    NODE_ENV,
    PORT,
    connection,
    FACEBOOK_APP_SECRET, FACEBOOK_APP_ID
}
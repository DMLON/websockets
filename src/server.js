const dotenv = require("dotenv");
dotenv.config();

const { MONGODB_URI, SECRET } = process.env;

const express = require("express");
var path = require("path");
const requestIp = require('request-ip');

const cookieParser = require("cookie-parser");

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(requestIp.mw())

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// ------------- DB Config -------------
const { DBConnector } = require("./database/connector");
const MariaDBOptions = require("./database/options/mariaDB");
const SQLite3Options = require("./database/options/SQLite3");

const db_products = new DBConnector("products", MariaDBOptions.options);
const db_messages = new DBConnector("messages", SQLite3Options.options);

// ------------- End DB Config -------------

// Session:
const session = require("express-session");
const MongoSession = require("connect-mongodb-session");

const MongoStore = MongoSession(session);

const store = new MongoStore({
    uri: MONGODB_URI,
    collection: "sessions",
});

const sessionMiddleware = session({
    store,
    resave: true,
    saveUninitialized: true,
    secret: SECRET,
    cookie: {
        maxAge: 50 * 1000, // 5 seg
    },
    rolling: true,
});

app.use(sessionMiddleware);
// ------------- End Express Configuration ----------------

// Routers
const router_chat = require("./routers/chat.router")(db_messages);
app.use("/chat", router_chat);

const router_products = require("./routers/products.router")(db_products);
app.use("/products", router_products);

const router_login = require("./routers/login.router");
app.use("/auth", router_login);


const {router_faker} = require("./routers/faker.products.router");
app.use("/api", router_faker);


app.get("/", (req, res) => {
    res.redirect("/chat");
});

const PORT = process.env.port || 8080;
app.listen(PORT, (err) => {
    if (err) throw new Error(`Error creating server ${err}`);
    console.log(`Server started on ${PORT}`);
});

const dotenv = require("dotenv");
dotenv.config();

const { MONGODB_URI, SECRET, NODE_ENV } = process.env;

const express =         require("express");
const path =            require("path");
const requestIp =       require('request-ip');
const cookieParser =    require("cookie-parser");
const flash =           require('connect-flash');
// Session:
const session =         require("express-session");
const MongoSession =    require("connect-mongodb-session");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(requestIp.mw())
app.use(flash());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

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
        maxAge: 15 * 1000, // 5 seg
        sameSite: NODE_ENV == 'development' ? 'lax' : 'strict', 
    },
    rolling: true,
});

app.use(sessionMiddleware);
// ------------- End Express Configuration ----------------

const {router_login, passport} = require("./routers/login.router");
app.use(passport.initialize()).use(passport.session());

// Routers
const {router_chat} = require("./routers/chat.router");
app.use("/chat", router_chat);

const {router_products} = require("./routers/products.router");
app.use("/products", router_products);


app.use("/auth", router_login);


const router_api = require("./routers/backend/api.backend.router");
app.use("/api", router_api);

// use info router
const router_info = require("./routers/info.router");
app.use("/info", router_info);

app.get("/", (req, res) => {
    res.redirect("/products");
});


// use minimist to load the port number from command line
const argv = require('minimist')(process.argv.slice(2));
const PORT = argv.port || 8080;
app.listen(PORT, (err) => {
    if (err) throw new Error(`Error creating server ${err}`);
    console.log(`Server started on ${PORT}`);
});


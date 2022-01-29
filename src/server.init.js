const config = require('./config.js');

const express =         require("express");
const path =            require("path");
const requestIp =       require('request-ip');
const cookieParser =    require("cookie-parser");
const flash =           require('connect-flash');
// Session:
const session =         require("express-session");
const MongoSession =    require("connect-mongodb-session");
const compression =     require("compression");
const {loggerWarnings,loggerErrors ,loggerDefault } = require('./utils/loggers');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(requestIp.mw())
app.use(flash());
app.use(compression());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

const MongoStore = MongoSession(session);

const store = new MongoStore({
    uri: config.MONGODB_URI,
    collection: "sessions",
});

const sessionMiddleware = session({
    store,
    resave: true,
    saveUninitialized: true,
    secret: config.SECRET,
    cookie: {
        maxAge: 30 * 1000*60, // 5 seg
        sameSite: config.NODE_ENV == 'development' ? 'lax' : 'strict', 
    },
    rolling: true,
});

app.use(sessionMiddleware);
// ------------- End Express Configuration ----------------
const GraphQLController = require('./controllers/graphQLController.js');
app.use('/graphql', new GraphQLController());

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
    loggerWarnings.warn("Redirecting to /products");
    res.redirect("/products");
});


module.exports = app
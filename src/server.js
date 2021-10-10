const dotenv = require("dotenv");
dotenv.config();

const { MONGODB_URI, SECRET } = process.env;

const express = require("express");
var path = require("path");
const faker = require("faker");

const cookieParser = require("cookie-parser");

const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

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
        maxAge: 5 * 1000, // 10 min
    },
    rolling: true,
});

app.use(sessionMiddleware);

io.use(function (socket, next) {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
});

io.on("connection", async (socket) => {
    console.log(socket.request.session);

    // Me parece que no hace falta poner el disconnect acá, en general se rompe, por eso el "?"
    socket.on('disconnect',(socket)=>{
        socket.request?.session.destroy(err=>{
            if(!err) res.send("Logout OK!");
            else res.send({status:"Logout Error",body:err});
        })
    });
});
// ------------- End Express Configuration ----------------

// Routers
const router_chat = require("./routers/chat.router")(io, db_messages);
app.use("/chat", router_chat);

const router_products = require("./routers/products.router")(io, db_products);
app.use("/products", router_products);

const router_login = require("./routers/login.router")(io);
app.use("/auth", router_login);

//------------Entrega desafio Faker------------
app.get("/api/products-test", async (req, res) => {
    console.log("GET /api/products-test");
    const products = [];
    for (let i = 0; i < 5; i++) {
        products.push({
            title: faker.commerce.productName(),
            price: Math.round(Math.random() * 1000),
            thumbnail: faker.image.food(50, 50),
        });
    }
    res.send(products);
});
//------------Entrega desafio Faker------------

app.get("/", (req, res) => {
    res.redirect("/chat");
});

const PORT = process.env.port || 8080;
server.listen(PORT, (err) => {
    if (err) throw new Error(`Error creating server ${err}`);
    console.log(`Server started on ${PORT}`);
});

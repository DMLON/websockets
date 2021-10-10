const express = require('express');
var path = require('path');
const faker = require("faker");

const cookieParser = require('cookie-parser')

const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

app.set('views',path.join(__dirname, 'views'));
app.set('view engine','pug');

// ------------- End Express Configuration ----------------


const {DBConnector} = require('./database/connector'); 
const MariaDBOptions = require('./database/options/mariaDB');
const SQLite3Options = require('./database/options/SQLite3');

const db_products = new DBConnector('products',MariaDBOptions.options);
const db_messages = new DBConnector('messages',SQLite3Options.options);

const router_chat = require("./routers/chat.router")(io,db_messages);
app.use("/chat",router_chat);

const router_products = require("./routers/products.router")(io,db_products);
app.use("/products",router_products);



//------------Entrega desafio Faker------------
app.get('/api/products-test', async (req,res)=>{
    
    console.log('GET /api/products-test');
    const products = []
    for (let i = 0; i < 5; i++) {
        products.push({
            title:faker.commerce.productName(),
            price: Math.round(Math.random()*1000),
            thumbnail:faker.image.food(50,50)
        });        
    }
    res.send(products);
});
//------------Entrega desafio Faker------------


app.get('/',(req,res)=>{
    res.redirect("/chat")
})

const PORT = process.env.port || 8080;
server.listen(PORT, (err) => {
    if(err)
        throw new Error(`Error creating server ${err }`);
    console.log(`Server started on ${PORT }`);
});




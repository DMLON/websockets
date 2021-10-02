const express = require('express');
const app = express();
const faker = require("faker");
const axios = require('axios');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('views','./views');
app.set('view engine','pug');

// ------------- End Express Configuration ----------------


// Validation middleware
const validateProduct = require('./middlewares/productValidator');
const {DBConnector} = require('./database/connector'); 
const MariaDBOptions = require('./database/options/mariaDB');
const SQLite3Options = require('./database/options/SQLite3');

const db_products = new DBConnector('products',MariaDBOptions.options);
const db_messages = new DBConnector('messages',SQLite3Options.options);

// main form containing infor for new products

const connectedUsers = []

io.on('connection',async socket=>{
    console.log("Client connected");
    connectedUsers.push({id:socket.id,name:"",email:"",profilePicture:"https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg"})
    
    //------------Entrega desafio Faker------------
    let products = []
    try{
        const res = await axios.get('http://localhost:8080/api/products-test');
        products = res.data;
    }
    catch(err){
        console.log("Unable to get product list",err);
    }
    //------------Entrega desafio Faker------------

    // socket.emit envia unicamente al usuario que hace connection
    socket.emit('products',products);



    socket.emit('users',connectedUsers);

    // Agrego un event listener para cuando haya un nuevo producto
    // Esto se emite desde el cliente
    socket.on('newProduct',async product=>{
        try{
            const id = await db_products.save(product)//     // console.log('POST /products');
        }
        catch(error){
            console.log(error);
        }
        // io.emit envia broadcast a todos los usuarios
        const products = await db_products.getAll();
        io.emit('products',products);
    });


    // ----- MESSAGES -----
    const messages = await db_messages.getAll();
    socket.emit('messages',messages);

    socket.on('newMessage',async message=>{
        try{
            const index = connectedUsers.map(user => user.id).indexOf(String(socket.id));
            const user = connectedUsers[index]
            const id = await db_messages.save({...message, name:user.name ,profilePicture:user.profilePicture, email:user.email})//     // console.log('POST /products');
        }
        catch(error){
            console.log(error);
        }
        // io.emit envia broadcast a todos los usuarios
        const messages = await db_messages.getAll();
        io.emit('messages',messages);
    });

    socket.on("changeEmail",async email=>{
        const index = connectedUsers.map(user => user.id).indexOf(String(socket.id));
        if (index > -1) {
            connectedUsers[index].email = email;
        }
        io.emit('users',connectedUsers);
    })
    
    socket.on("changePicture",async picture=>{
        const index = connectedUsers.map(user => user.id).indexOf(String(socket.id));
        if (index > -1) {
            connectedUsers[index].profilePicture = picture;
        }
        io.emit('users',connectedUsers);
    })

    socket.on("changeName",async name=>{
        const index = connectedUsers.map(user => user.id).indexOf(String(socket.id));
        if (index > -1) {
            connectedUsers[index].name = name;
        }
        io.emit('users',connectedUsers);
    })

    socket.on("disconnect",async socketDisc=>{
        console.log("Client disconnected");
        // Saco el usuario de los conectados
        const index = connectedUsers.map(user => user.id).indexOf(String(socket.id));
        if (index > -1) {
            connectedUsers.splice(index, 1);
        }
    });
});


app.get('/',(req,res)=>{
    res.redirect("/chat")
})

app.get('/products', async (req,res)=>{
    console.log('GET /products');
    res.render("productsShow.pug");
});

app.get('/chat', async (req,res)=>{
    console.log('GET /chat');
    res.render("chat.pug");
});

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


const PORT = 8080;
server.listen(PORT, (err) => {
    if(err)
        throw new Error(`Error creating server ${err }`);
    console.log(`Server started on ${PORT }`);
});




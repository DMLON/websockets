const express = require('express');
const app = express();

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
const {Container} = require('./container'); 
const db_products = new Container('./products.json');
const db_messages = new Container('./messages.json');

// main form containing infor for new products

const connectedUsers = []

io.on('connection',async socket=>{
    console.log("Client connected");
    connectedUsers.push({id:socket.id,name:"",email:"",profilePicture:"https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg"})
    const products = await db_products.getAll();

    // socket.emit envia unicamente al usuario que hace connection
    socket.emit('products',products);



    socket.emit('users',connectedUsers);

    // Agrego un event listener para cuando haya un nuevo producto
    // Esto se emite desde el cliente
    socket.on('newProduct',async product=>{
        try{
            product = JSON.parse(product);
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
            message = JSON.parse(message);
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

const PORT = 8080;
server.listen(PORT, (err) => {
    if(err)
        throw new Error(`Error creating server ${err }`);
    console.log(`Server started on ${PORT }`);
});




module.exports = function (io,db_messages) {
    const express = require("express");
    const router = express.Router();
    const connectedUsers = [];


    io.on("connection", async (socket) => {
        console.log("Client connected - Chat");
        connectedUsers.push({
            id: socket.id,
            name: "",
            email: "",
            profilePicture: "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg",
        });

        // console.log(socket.request.session);

        socket.emit("users", connectedUsers);

        // ----- MESSAGES -----
        const messages = await db_messages.getAll();
        socket.emit("messages", messages);

        socket.on("newMessage", async (message) => {
            try {
                const index = connectedUsers.map((user) => user.id).indexOf(String(socket.id));
                const user = connectedUsers[index];
                const id = await db_messages.save({ ...message, name: user.name, profilePicture: user.profilePicture, email: user.email }); //     // console.log('POST /products');
            } catch (error) {
                console.log(error);
            }
            // io.emit envia broadcast a todos los usuarios
            const messages = await db_messages.getAll();
            io.emit("messages", messages);
        });

        socket.on("changeEmail", async (email) => {
            const index = connectedUsers.map((user) => user.id).indexOf(String(socket.id));
            if (index > -1) {
                connectedUsers[index].email = email;
            }
            io.emit("users", connectedUsers);
        });

        socket.on("changePicture", async (picture) => {
            const index = connectedUsers.map((user) => user.id).indexOf(String(socket.id));
            if (index > -1) {
                connectedUsers[index].profilePicture = picture;
            }
            io.emit("users", connectedUsers);
        });

        socket.on("changeName", async (name) => {
            const index = connectedUsers.map((user) => user.id).indexOf(String(socket.id));
            if (index > -1) {
                connectedUsers[index].name = name;
            }
            io.emit("users", connectedUsers);
        });

        socket.on("disconnect", async (socketDisc) => {
            console.log("Client disconnected");
            // Saco el usuario de los conectados
            const index = connectedUsers.map((user) => user.id).indexOf(String(socket.id));
            if (index > -1) {
                connectedUsers.splice(index, 1);
            }
            io.emit("users", connectedUsers);
        });
    });

    router.get("/", async (req, res) => {
        console.log("GET /chat");
        res.render("chat.pug");
    });

    return router;
};

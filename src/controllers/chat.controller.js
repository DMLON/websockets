

const showChat =async (req, res) => {
    const ip = req.clientIp;
    loggerDefault.info(`[${ip}] - GET /chat`);
    const loggedIn = req.session.loggedIn;

    if (!loggedIn) {
        loggerDefault.info("User already logged");
        res.redirect("/");
        return;
    }

    const user = req.session.user;
    //Normalmente renderaria los primeros N mensajes y a medida que se scrolle obteneria más
    const messages = await db_messages.getAll();
    res.render("chat.pug", { loggedIn, user, messages, formatDate });
}

const newMessage = async (req, res) => {
    const ip = req.clientIp;
    loggerDefault.info(`[${ip}] - POST /chat`);
    const loggedIn = req.session.loggedIn;
    const { message, date } = req.body;
    if (!loggedIn) {
        loggerErrors.error("User not logged");
        res.send({ error: true, status: "You are not logged in!", redirectURL: "/products" });
        return;
    }
    try {
        const user = req.session.user;
        const id = await db_messages.save({ message, date: date, name: user.username, profilePhoto: user.profilePhoto, email: user.email }); //     // console.log('POST /products');
    } catch (error) {
        res.send({ error: true, status: "DB error" });
        loggerErrors.error(error);
        return;
    }
    res.send({ error: false, status: "ok", redirectURL: "/chat" });
}

module.exports={
    showChat, newMessage
}
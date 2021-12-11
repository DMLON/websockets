


const getproducts =async (req,res)=>{
    const ip = req.clientIp;
    loggerDefault.info(`[${ip}] - GET /products`);
    const { loggedIn, user } = req.session;
    if (!loggedIn) {
        loggerErrors.error(`[${ip}] - GET /products - User not logged in`);
        res.render("productsShow.pug", { loggedIn, products: [] });
        return;
    }
    res.render("productsShow.pug", { loggedIn, username: user?.username, products });

}

const newProduct = async (req, res) => {
    const ip = req.clientIp;
    loggerDefault.info(`[${ip}] - POST /products`);

    const { loggedIn } = req.session;
    if (!loggedIn) {
        loggerErrors.error(`[${ip}] - POST /products - Not logged in`);
        res.send({ error: true, status: "You are not logged in!" });
        return;
    }

    // If user is logged in, get product from body and add it
    const product = req.body;
    products.push(product);

    res.send({ error: false, status: "ok" });
}

module.exports = {
    getproducts,newProduct
}
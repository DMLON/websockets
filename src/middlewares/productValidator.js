const joi = require('joi');

const productVerification = joi.object({
    productId: joi.string(),
    title: joi.string().required(),
    price: joi.number().min(0).required(),
    thumbnail: joi.string().required(),
});

async function validateProduct(req,res,next){
    const {body} = req
    try{
        await productVerification.validateAsync(body)
        next();
    }
    catch(error){
        next(error)
    }
}

module.exports = validateProduct;
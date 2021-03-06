
const fs = require('fs');
const path = require('path');
const generateProducts = async ()=>{
    const {options} = require('./options/SQLite3');
    let destroyed = false;

    const knex_products = require('knex')(options);
    //---------- MariaDB ----------
    try{
        await knex_products.schema.dropTable('products');
    }catch(err){
        console.log("Could not delete products table")
    }
    try{
        await knex_products.schema.createTable('products', (table) => {
            table.increments('id')
            table.string('title')
            table.float('price')
            table.string('thumbnail')
        });
        console.log("Products table created");
        try{
            const content = await fs.promises.readFile(path.join(__dirname, '/products.json'),'utf-8');
            try{
                const objets =  JSON.parse(content);
                try{
                    await knex_products
                    .from('products')
                    .insert(objets)
                }
                catch(err){
                    console.log(`Error ocurred when creating products ${err}`);
                    if(!destroyed){
                        knex_products.destroy();
                        destroyed = true;
                    }
                    throw err;
                }
                if(!destroyed){
                    knex_products.destroy();
                    destroyed = true;
                }

            }
            catch(parseError){
                console.log(parseError);
            }
        }
        catch(error){
            throw `Error while reading file: ${error}`;
        }
    }
    catch(err){
        console.log(`Error ocurred when creating products table ${err}`);
        console.error(err);
        if(!destroyed){
            knex_products.destroy();
            destroyed = true;
        }
        throw err;
    };
}

const generateMessages = async () =>{
    const {options} = require('./options/SQLite3');
    const knex_messages= require('knex')(options);
    //--------- SQLite3 ----------
    let destroyed = false;
    try{
        await knex_messages.schema.dropTable('messages');
    }catch(err){
        console.log("Could not delete messages table")
    }
    try{
        await knex_messages.schema.createTable('messages', (table) => {
            table.increments('id')
            table.string('message')
            table.timestamp('date')
            table.string('profilePhoto')
            table.string('email')
            table.string('name')
        });
        console.log("Messages table created");
        try{
            const content = await fs.promises.readFile(path.join(__dirname, '/messages.json'),'utf-8');
            try{
                const objets =  JSON.parse(content);
                try{
                    await knex_messages
                    .from('messages')
                    .insert(objets)
                }
                catch(err){
                    console.log(`Error ocurred when creating messages ${err}`);
                    if(!destroyed){
                        knex_messages.destroy();
                        destroyed = true;
                    }
                    throw err;
                }
                if(!destroyed){
                    knex_messages.destroy();
                    destroyed = true;
                }

            }
            catch(parseError){
                console.log(parseError);
            }
        }
        catch(error){
            throw `Error while reading file: ${error}`;
        }
    }
    catch(err){
        console.log(`Error ocurred when creating Messages table ${err}`);
        if(!destroyed){
            knex_messages.destroy();
            destroyed = true;
        }
        throw err;
    }
    if(!destroyed){
        knex_messages.destroy();
        destroyed = true;
    }
}

const generateUsertable = async ()=>{
    const {options} = require('./options/SQLite3');
    console.log(options)
    const knex = require('knex')(options);

    try{
        await knex.schema.dropTable('users');
    }catch(err){
        console.log("Could not delete messages table")
    }
    await knex.schema.createTable('users', (table) => {
        table.increments('id')
        table.string('username')
        table.string('email')
        table.string('password')
        table.string('profilePhoto')
        table.string('authMethod')
        table.string('firstName')
        table.string('lastName')
    });


    await knex
        .from('users')
        .insert({
            username:"admin",
            email:"admin@admin.com",
            password:"admin",
            profilePhoto:"none",
            authMethod:"local",
            firstName:"admin",
            lastName:"admin"
        })
}

const generateTablesAll = async ()=>{
    try{
        await generateProducts();
    }
    catch(err){
        console.log("Could not generate products table");
    }
    
    try{
        await generateMessages();
    }
    catch(err){
        console.log("Could not generate messages table");
    }

    try{
        await generateUsertable();
    }
    catch(err){
        console.log("Could not generate messages table");
    }
    
}

generateProducts();



async function test(){
    const {options} = require('./options/SQLite3');
    console.log(options)
    const knex = require('knex')(options);

    const user = await knex
        .from('users')
        .where({username:"admin"})

    console.log(user[0]);
}

test();
module.exports = {
    generateMessages,
    generateProducts
}
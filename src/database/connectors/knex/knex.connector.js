
const {loggerWarnings,loggerErrors ,loggerDefault } = require('../../../utils/loggers');
const {DbClient} = require('../base/DbClient');
class KnexDBConnector extends DbClient{
    constructor(table,config){
        super();
        this.config = config
        this.table = table;
        this.knex=null;
    }

    async connect(){
        this.knex = require('knex')(this.config);
        try{
            const res = await this.knex.raw("SELECT 1")
            loggerDefault.info("Knex DB connected");
        }
        catch(err){
            loggerErrors.error("Knex DB not connected");
            throw err;
        }
    }

    async disconnect(){
        this.knex.destroy();
    }
}


class DBTester{
    constructor(table,options_filename,generator,initial_row_count,test_obj){
        this.generator = generator;
        this.table = table;
        this.options_filename = options_filename;
        this.tests_total = 5;
        this.initial_row_count = initial_row_count;
        this.test_obj = test_obj;
    }
    async test_insert(){
        const {options} = require(this.options_filename);
        const db = new KnexDBConnector(this.table,options);
    
        
    
        let res = await db.save(this.test_obj);
        console.log(res);
        db.destroy();
        return res;
    }
    
    async test_select_all(){
        const {options} = require(this.options_filename);
        const db = new KnexDBConnector(this.table,options);
    
        let res = await db.getAll();
        console.log(res);
        db.destroy();
        return res
    }
    
    async test_select_id(){
        const {options} = require(this.options_filename);
        const db = new KnexDBConnector(this.table,options);
    
        let res = await db.getById(1);
        console.log(res);
        db.destroy();
        return res;
    }
    
    async test_delete_id(){
        const {options} = require(this.options_filename);
        const db = new KnexDBConnector(this.table,options);
    
        let res = await db.deleteById(1);
        console.log(res);
        db.destroy();
        return res;
    }
    
    async test_delete_all(){
        const {options} = require(this.options_filename);
        const db = new KnexDBConnector(this.table,options);
    
        let res = await db.deleteAll();
        console.log(res);
        db.destroy();
        return res;
    }

    async testAll(){
        console.log(`--------- ${this.table} Tester ---------`)
        let test_count = 0;
        await this.generator();

        try{
            const objs = await this.test_select_all();
            if(objs.length == this.initial_row_count){
                console.log("test_select_all OK!");
                test_count+=1;
            }
            else{
                console.log("test_select_all BAD!");
            }
        }
        catch(err){
            console.log("test_select_all BAD!");
        }

        try{
            const id = await this.test_insert();
            const objs = await this.test_select_all();
            if(objs.length == this.initial_row_count + 1 && id == this.initial_row_count + 1){
                console.log("test_insert OK!");
                test_count+=1;
            }
            else{
                console.log("test_insert BAD!");
            }
        }
        catch(err){
            console.log("test_insert BAD!");
        }

        try{
            const obj = await this.test_select_id();
        
            if(obj.id == 1){
                console.log("test_select_id OK!");
                test_count+=1;
            }
            else{
                console.log("test_select_id BAD!");
            }
        }
        catch(err){
            console.log("test_select_id BAD!");
        }

        try{
            await this.test_delete_id();
            const objs = await this.test_select_all();
            const obj = await this.test_select_id();
            if(objs.length == this.initial_row_count && obj == null){
                console.log("test_delete_id OK!");
                test_count+=1;
            }
            else{
                console.log("test_delete_id BAD!");
            }
        }
        catch(err){
            console.log("test_delete_id BAD!");
        }

        try{
            await this.test_delete_all();
            const objs = await this.test_select_all();
            if(objs.length == 0){
                console.log("test_delete_all OK!");
                test_count+=1;
            }
            else{
                console.log("test_delete_all BAD!");
            }
        }
        catch(err){
            console.log("test_delete_all BAD!");
        }

        console.log(`--------- DONE ${this.table} Tester ${test_count}/${this.tests_total}---------`)
    }

}


async function test_dbs(){
    const {generateMessages, generateProducts} = require('../../generateTables')
    const test_prod = {
        title: "Sword",
        price: 1358,
        thumbnail: "https://cdn3.iconfinder.com/data/icons/fantasy-and-role-play-game-adventure-quest/512/Sword-64.png"
    };
    const tester_products = new DBTester('products','./options/mariaDB',generateProducts,12,test_prod);
    await tester_products.testAll();


    const test_message= {
        message: "asdasd",
        date: "2021-08-30T20:45:52.588Z",
        name: "dddd",
        profilePhoto: "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg",
        email: "dddd"
    }
    const tester_messages = new DBTester('messages','./options/SQLite3.js',generateMessages,6,test_message);
    await tester_messages.testAll();
}

// test_dbs();

exports.KnexDBConnector = KnexDBConnector;
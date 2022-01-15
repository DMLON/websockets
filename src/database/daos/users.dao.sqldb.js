const {UsersDao} = require('./users.dao');
const {UserModel}= require('../models/users.model');
const { UserDto } = require('../dtos/user.dto.js');
const { loggerErrors } = require('../../utils/loggers');
const { UserInfoSafe } = require('../adapters/user.info');

let instance = null;

class UsersDaoDb extends UsersDao {

    constructor(database) {
        super()
        this.users = database.knex;
        this.table = 'users';
    }

    async save(object){
        
        try{
            const user = new UserModel(object);
            const id = await this.users(this.table)
                .insert(user)
            return id[0];
        }
        catch(err){
            loggerErrors.error(err);
            throw err;
        }
    }

    async getById(id){
        try{
            const obj = await this.users(this.table)
                .select('*')
                .where({id:id})
            if(obj.length == 0)
                return null;
            const user = new UserDto(obj[0]);
            return user;
        }
        catch(err){
            loggerErrors.error(err);
            throw err;
        }
    }

    async getAll(){
        try{
            const objs = await this.users(this.table)
                .select('*');
            //Devuelvo la info de todos SIN password
            //Ver si es conveniente
            const users = objs.map(obj => new UserInfoSafe(obj));
            return users;
        }
        catch(err){
            loggerErrors.error(err);
            throw err;
        }
    }

    async deleteById(id){
        try{
            const objs = await this.users(this.table)
                .where({ id: id })
                .del()
            return objs;
        }
        catch(err){
            loggerErrors.error(err);
            throw err;
        }
    }

    async deleteAll(){
        try{
            const objs = await this.users(this.table)
                .del()
            return objs;
        }
        catch(err){
            loggerErrors.error(err);
            throw err;
        }
    }

    async getUserByUsername(username,authMethod)
    {
        const user = await this.users(this.table).where({ username: username }).andWhere({ authMethod: authMethod });
        try{
            if(user.length == 0)
                return null;
            const user_dto = new UserDto(user[0]);
            return user_dto;
        }
        catch(err){
            loggerErrors.error(err);
            return null;
        }
        
    }

    async getUserByUsernameOrEmail(username,email)
    {
        const user = await this.users(this.table).where({ username: username }).orWhere({ email: email });
        try{
            if(user.length == 0)
                return null;
            const user_dto = new UserDto(user[0]);
            return user_dto;
        }
        catch(err){
            loggerErrors.error(err);
            return null;
        }
    }

    async getUserByEmail(email){
        const user = await this.users(this.table).where({ email: email });
        try{
            if(user.length == 0)
                return null;
            const user_dto = new UserDto(user[0]);
            return user_dto;
        }
        catch(err){
            loggerErrors.error(err);
            return null;
        }
    }



    static getInstance(database){
        if(!instance){
            if(!database)
                throw new Error('Database is required');
            instance = new UsersDaoDb(database);
        }
        return instance;
    }


}

module.exports = UsersDaoDb;

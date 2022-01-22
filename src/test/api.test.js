const request = require("supertest").agent
const expect = require("chai").expect

let cookie = null;
const app = require("../server.init");
const agent = request(app);

beforeEach((done)=>{
    agent
        .post('/auth/login')
        .send({ username: 'user', password: 'password' })
        .expect(302)
        .expect('Location', '/')
        .end((err,res)=>{
            if(err) throw err
            done()
        })
    
})

describe('GET Products', () => {
    it('Should get all products and return status 200.', (done) => {

        agent
            .get("/api/products")
            .expect(200)
            .end((err,res)=>{
                if(err) done(err)
                expect(res.body.products).to.be.an('array')
                expect(res.status).to.equal(200)
                done()
            })
        
    })
})


describe('Add new Product', () => {
    it('Should create a new product', (done) => {

        agent
            .post("/products")
            .send({title:"Test product",
                price:100,
                thumbnail:"TestThumbnail"}
            )
            .expect(200)
            .end((err,res)=>{
                if(err) done(err)
                expect(res.body.error).to.be.false
                expect(res.status).to.equal(200)
                done()
            })
        
    })
})


describe('Delete Product', () => {
    let idToDelete=null
    //Get the last product
    before((done)=>{
        agent
        .get("/api/products")
        .expect(200)
        .end((err,res)=>{
            if(err) done(err)
            expect(res.body.products).to.be.an('array')
            expect(res.status).to.equal(200)
            idToDelete = res.body.products[res.body.products.length-1].id
            done()
        })
    })
    it('Should delete the last product', (done) => {       
        agent
            .delete("/products/"+idToDelete)
            .expect(200)
            .end((err,res)=>{
                if(err) done(err)
                expect(res.body.error).to.be.false
                expect(res.status).to.equal(200)
                done()
            })
        
    })
})



describe('Edit the last Product', () => {
    let originalProduct=null
    //Get the last product
    before((done)=>{
        agent
        .get("/api/products")
        .expect(200)
        .end((err,res)=>{
            if(err) done(err)
            expect(res.body.products).to.be.an('array')
            expect(res.status).to.equal(200)
            originalProduct = res.body.products[res.body.products.length-1]
            done()
        })
    })
    it('Should delete the last product', (done) => {       
        agent
            .put("/products/"+originalProduct.id)
            .send({price:originalProduct.price,title:"Test product Edit",thumbnail:originalProduct.thumbnail})
            .expect(200)
            .end((err,res)=>{
                if(err) done(err)
                expect(res.body.error).to.be.false
                expect(res.body.object.title).to.equal("Test product Edit")
                expect(res.status).to.equal(200)
                done()
            })
        
    })
})
const request = require("supertest").agent
const expect = require("chai").expect

let cookie = null;
const app = require("../server.init");
const agent = request(app);

// beforeEach((done)=>{
//     agent
//         .post('/auth/login')
//         .send({ username: 'user', password: 'password' })
//         .expect(302)
//         .expect('Location', '/')
//         .end((err,res)=>{
//             if(err) throw err
//             // session = res.headers['set-cookie']
//                 // .split(',')
//                 // .map(item => item.split(';')[0])
//                 // .join(';'); 
//             // console.log(session)
//             done()
//         })
    
// })

describe('GET Products', () => {
    it('should login', (done) => {
        agent
        .post('/auth/login')
        .send({ username: 'user', password: 'password' })
        .expect(302)
        .expect('Location', '/')
        .end((err,res)=>{
            if(err) done(err)
            cookie = res.headers['set-cookie'][0]; //Setting the cookie
            // session = res.headers['set-cookie']
                // .split(',')
                // .map(item => item.split(';')[0])
                // .join(';'); 
            // console.log(session)
            done()
        });
    });
    it('Should get all products and return status 200.', (done) => {
        // const res = await agent
        //     .get("/api/products")
        // console.log(res.body)

        agent
            .get("/api/products")
            .expect(200)
            .set('Cookie', cookie)
            .end((err,res)=>{
                if(err) done(err)
                console.log(res.body)
                expect(res.body).to.be.an('array')
                expect(res.status).to.equal(200)
                done()
            })
        
    })
})

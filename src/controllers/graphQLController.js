
const { graphqlHTTP }=require("express-graphql");
const { buildSchema }= require("graphql");

const schema = buildSchema(`

  type Product {
    id: ID!,
    title: String,
    price: Float,
    thumbnail:String
  }
  input ProductInput {
    title: String,
    price: Float,
    thumbnail:String
  }
  type Query {
    getProducts: [Product],
  }
  type Mutation {
    createProduct(object: ProductInput): Product
    editProduct(id: ID!,object: ProductInput): Product,
    deleteProduct(id: ID!): Product,
  }
`);

const {getDao} = require("../database/daos/products.dao.factory")


class GraphQLController {
    constructor() {
        const db_products = getDao();
        return graphqlHTTP({
            schema: schema,
            rootValue: {
                getProducts: () => db_products.getAll(),
                createProduct: (data)=>{
                  return {id:db_products.save(data)}
                },
                editProduct: (data)=>{
                  return db_products.update(data.id,data)
                },
                deleteProduct: (data)=>{
                  return db_products.deleteById(data.id)
                },
            },
            graphiql: true,
        });
    }
}

module.exports = GraphQLController
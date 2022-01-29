
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

  type Message {
    id: ID!,
    message: String,
    date: String,
    profilePhoto: String,
    email: String,
    name: String
  }
  input MessagesInput {
    message: String,
    profilePhoto: String,
    email: String,
    name: String
  }

  type Query {
    getProducts: [Product],

    getMessages: [Message],
  }
  type Mutation {
    createProduct(object: ProductInput): Product
    editProduct(id: ID!,object: ProductInput): Product,
    deleteProduct(id: ID!): Product,

    createMessage(object: MessagesInput): Message
  }
`);



class GraphQLController {
    constructor(resolver) {
        return graphqlHTTP({
            schema: schema,
            rootValue: resolver,
            graphiql: true,
        });
    }
}

module.exports = GraphQLController
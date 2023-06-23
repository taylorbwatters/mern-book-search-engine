const typeDefs = `#graphql
    type Query {
        me: User
    }

    type Mutation {
        login(username: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        
        saveBook(
            title: String!
            bookId: String!
            image: String!
            link: String!
        ): User
        removeBook(bookId: String!): User
    }

    type User {
        username: String!
        email: String!
        bookCount: Int!
        savedBooks: [Book]
    }

    type Book {
        authors: [String]
        description: String!
        bookId: String!
        title: String!
        image: String
        link: String
    }

    type Auth {
        token: String!
        user: User
    }
`;

module.exports = { typeDefs };
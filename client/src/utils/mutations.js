import { gql } from '@apollo/client';

export const REMOVE_BOOK = gql`
    mutation RemoveBook($bookId: String!) {
        removeBook(bookId: $bookId) {
            username
        }
    }
`;


export const SAVE_BOOK = gql`
    mutation SaveBook(
        $authors: [String],
        $description: String!,
        $bookId: String!, 
        $title: String!, 
        $image: String!, 
        $link: String!,
    ) {
        saveBook(
            authors: $authors,
            description: $description,
            bookId: $bookId, 
            title: $title, 
            image: $image, 
            link: $link,
        ) {
            username
        }
    }
`;

export const ADD_USER = gql`
    mutation AddUser(
        $username: String!, 
        $email: String!, 
        $password: String!,
    ) {
        addUser(
            username: $username,
            email: $email, 
            password: $password
        ) {
            token
        }
    }
`;

export const LOGIN_USER = gql`
    mutation LoginUser(
        $username: String!, 
        $password: String!,
    ) {
        login(
            username: $username,
            password: $password
        ) {
            token
        }
    }
`;
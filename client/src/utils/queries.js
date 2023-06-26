import { gql } from '@apollo/client';

export const GET_ME = gql`
    query GetMe {
        me {
            email
            username
            bookCount

            savedBooks {
                bookId
                link
                image
                title
                authors
                description
            }
        }
    }
`;

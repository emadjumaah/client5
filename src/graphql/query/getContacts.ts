import { gql } from '@apollo/client';

export default gql`
  query getContacts {
    getContacts {
      ok
      error
      data {
        _id
        name
        nameAr
        phone
        email
        company
        address
        groupIds

        customerId
        userId

        notes

        createdAt
        updatedAt
      }
    }
  }
`;

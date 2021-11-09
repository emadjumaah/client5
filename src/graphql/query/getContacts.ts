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
        groupIds
        customerId

        userId

        createdAt
        updatedAt
      }
    }
  }
`;

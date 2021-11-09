import { gql } from '@apollo/client';

export default gql`
  query getGroups {
    getGroups {
      ok
      error
      data {
        _id
        branch
        autoNo
        name
        nameAr
        qty
        conttype
        userId

        createdAt
        updatedAt
      }
    }
  }
`;

import { gql } from "@apollo/client";

export default gql`
  query getGroups($isRTL: Boolean) {
    getGroups(isRTL: $isRTL) {
      ok
      error
      data {
        _id
        branch
        autoNo
        docNo
        name
        nameAr
        userId
        tasks

        createdAt
        updatedAt
      }
    }
  }
`;

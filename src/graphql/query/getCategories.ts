import { gql } from "@apollo/client";

export default gql`
  query getCategories($isRTL: Boolean) {
    getCategories(isRTL: $isRTL) {
      ok
      error
      data {
        _id
        branch
        autoNo
        docNo
        catType
        name
        nameAr
        userId

        createdAt
        updatedAt
      }
    }
  }
`;

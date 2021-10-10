import { gql } from "@apollo/client";

export default gql`
  query getBrands($isRTL: Boolean) {
    getBrands(isRTL: $isRTL) {
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

        createdAt
        updatedAt
      }
    }
  }
`;

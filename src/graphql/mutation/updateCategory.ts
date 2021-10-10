import { gql } from "@apollo/client";

export default gql`
  mutation updateCategory(
    $_id: String
    $branch: String
    $catType: Int
    $name: String
    $nameAr: String
  ) {
    updateCategory(
      _id: $_id
      branch: $branch
      catType: $catType
      name: $name
      nameAr: $nameAr
    ) {
      ok
      message
      data
      error
    }
  }
`;

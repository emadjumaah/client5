import { gql } from "@apollo/client";

export default gql`
  mutation createCategory(
    $branch: String
    $catType: Int
    $name: String
    $nameAr: String
  ) {
    createCategory(
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

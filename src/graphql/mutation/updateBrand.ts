import { gql } from "@apollo/client";

export default gql`
  mutation updateBrand(
    $_id: String
    $branch: String
    $name: String
    $nameAr: String
  ) {
    updateBrand(_id: $_id, branch: $branch, name: $name, nameAr: $nameAr) {
      ok
      message
      data
      error
    }
  }
`;

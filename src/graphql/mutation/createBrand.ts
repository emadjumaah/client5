import { gql } from "@apollo/client";

export default gql`
  mutation createBrand($branch: String, $name: String, $nameAr: String) {
    createBrand(branch: $branch, name: $name, nameAr: $nameAr) {
      ok
      message
      data
      error
    }
  }
`;

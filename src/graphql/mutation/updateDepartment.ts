import { gql } from "@apollo/client";

export default gql`
  mutation updateDepartment(
    $_id: String
    $branch: String
    $name: String
    $nameAr: String
    $depType: Int
    $desc: String
    $color: String
  ) {
    updateDepartment(
      _id: $_id
      branch: $branch
      name: $name
      nameAr: $nameAr
      depType: $depType
      desc: $desc
      color: $color
    ) {
      ok
      message
      data
      error
    }
  }
`;

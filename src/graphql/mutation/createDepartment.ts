import { gql } from '@apollo/client';

export default gql`
  mutation createDepartment(
    $branch: String
    $name: String
    $nameAr: String
    $depType: Int
    $retype: RetypeInput
    $desc: String
    $color: String
  ) {
    createDepartment(
      branch: $branch
      name: $name
      nameAr: $nameAr
      depType: $depType
      retype: $retype
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

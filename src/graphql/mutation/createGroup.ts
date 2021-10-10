import { gql } from "@apollo/client";

export default gql`
  mutation createGroup(
    $branch: String
    $name: String
    $nameAr: String
    $tasks: [Int]
  ) {
    createGroup(branch: $branch, name: $name, nameAr: $nameAr, tasks: $tasks) {
      ok
      message
      data
      error
    }
  }
`;

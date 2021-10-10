import { gql } from "@apollo/client";

export default gql`
  mutation updateGroup(
    $_id: String
    $branch: String
    $name: String
    $nameAr: String
    $tasks: [Int]
  ) {
    updateGroup(
      _id: $_id
      branch: $branch
      name: $name
      nameAr: $nameAr
      tasks: $tasks
    ) {
      ok
      message
      data
      error
    }
  }
`;

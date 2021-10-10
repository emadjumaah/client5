import { gql } from "@apollo/client";

export default gql`
  mutation updateAccount(
    $_id: String
    $branch: String
    $code: Int
    $name: String
    $nameAr: String
    $parentcode: Int
    $parent: String
    $parentAr: String
    $accType: Int
    $balance: Float
    $closedAcc: Int
    $note: String
  ) {
    updateAccount(
      _id: $_id
      branch: $branch
      code: $code
      name: $name
      nameAr: $nameAr
      parentcode: $parentcode
      parent: $parent
      parentAr: $parentAr
      accType: $accType
      balance: $balance
      closedAcc: $closedAcc
      note: $note
    ) {
      ok
      message
      data
      error
    }
  }
`;

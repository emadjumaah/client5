import { gql } from "@apollo/client";

export default gql`
  mutation createAccount(
    $code: Int
    $branch: String
    $name: String
    $nameAr: String
    $parentcode: Int
    $parent: String
    $parentAr: String
    $accType: Int
    $balance: Float
    $canedit: Boolean
    $closedAcc: Int
    $note: String
  ) {
    createAccount(
      code: $code
      branch: $branch
      name: $name
      nameAr: $nameAr
      parentcode: $parentcode
      parent: $parent
      parentAr: $parentAr
      accType: $accType
      balance: $balance
      canedit: $canedit
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

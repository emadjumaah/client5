import { gql } from '@apollo/client';

export default gql`
  mutation createUserBranch(
    $pack: String
    $packStart: Date
    $packEnd: Date
    $temp: String
    $users: Int
    $username: String
    $password: String
    $name: String
    $nameAr: String
    $tel1: String
    $note: String
  ) {
    createUserBranch(
      pack: $pack
      packStart: $packStart
      packEnd: $packEnd
      temp: $temp
      users: $users
      username: $username
      password: $password
      name: $name
      nameAr: $nameAr
      tel1: $tel1
      note: $note
    ) {
      ok
      message
      data
      error
    }
  }
`;

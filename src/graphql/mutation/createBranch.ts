import { gql } from '@apollo/client';

export default gql`
  mutation createBranch(
    $pack: String
    $packStart: Date
    $packEnd: Date
    $temp: String
    $users: Int
    $username: String
    $password: String
    $name: String
    $nameAr: String
    $logo: String
    $tel1: String
    $tel2: String
    $fax: String
    $mob: String
    $email: String
    $website: String
    $address: String
    $poBox: String
    $CR: String
    $city: String
    $country: String
    $location: LocationInput
    $note: String
  ) {
    createBranch(
      pack: $pack
      packStart: $packStart
      packEnd: $packEnd
      temp: $temp
      users: $users
      username: $username
      password: $password
      name: $name
      nameAr: $nameAr
      logo: $logo
      tel1: $tel1
      tel2: $tel2
      fax: $fax
      mob: $mob
      email: $email
      website: $website
      address: $address
      poBox: $poBox
      CR: $CR
      city: $city
      country: $country
      location: $location
      note: $note
    ) {
      ok
      message
      data
      error
    }
  }
`;

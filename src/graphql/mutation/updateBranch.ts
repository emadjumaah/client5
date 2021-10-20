import { gql } from '@apollo/client';

export default gql`
  mutation updateBranch(
    $_id: String
    $pack: String
    $packStart: Date
    $packEnd: Date
    $users: Int
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
    updateBranch(
      _id: $_id
      pack: $pack
      packStart: $packStart
      packEnd: $packEnd
      users: $users
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

import { gql } from '@apollo/client';

export default gql`
  mutation updateCompany(
    $name: String
    $nameAr: String
    $tel1: String
    $tel2: String
    $fax: String
    $mob: String
    $email: String
    $website: String
    $address: String
    $logo: String
    $header: String
    $footer: String
    $color: String
  ) {
    updateCompany(
      name: $name
      nameAr: $nameAr
      tel1: $tel1
      tel2: $tel2
      fax: $fax
      mob: $mob
      email: $email
      website: $website
      address: $address
      logo: $logo
      header: $header
      footer: $footer
      color: $color
    ) {
      ok
      message
      data
      error
    }
  }
`;

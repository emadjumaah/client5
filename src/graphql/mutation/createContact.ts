import { gql } from '@apollo/client';

export default gql`
  mutation createContact(
    $name: String
    $nameAr: String
    $phone: String
    $email: String
    $address: String
    $groupIds: [String]
    $customerId: String
  ) {
    createContact(
      name: $name
      nameAr: $nameAr
      phone: $phone
      email: $email
      address: $address
      groupIds: $groupIds
      customerId: $customerId
    ) {
      ok
      message
      data
      error
    }
  }
`;

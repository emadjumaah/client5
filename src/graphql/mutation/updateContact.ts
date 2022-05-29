import { gql } from '@apollo/client';

export default gql`
  mutation updateContact(
    $_id: String
    $name: String
    $nameAr: String
    $phone: String
    $email: String
    $address: String
    $groupIds: [String]
    $customerId: String
    $company: String
    $notes: String
  ) {
    updateContact(
      _id: $_id
      name: $name
      nameAr: $nameAr
      phone: $phone
      email: $email
      address: $address
      groupIds: $groupIds
      customerId: $customerId
      company: $company
      notes: $notes
    ) {
      ok
      message
      data
      error
    }
  }
`;

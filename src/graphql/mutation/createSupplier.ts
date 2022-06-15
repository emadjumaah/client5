import { gql } from '@apollo/client';

export default gql`
  mutation createSupplier(
    $branch: String
    $name: String
    $nameAr: String
    $phone: String
    $mobile: String
    $email: String
    $address: String
    $avatar: String
    $logo: String
    $headphoto: String
    $employee: EmployeeInput
  ) {
    createSupplier(
      branch: $branch
      name: $name
      nameAr: $nameAr
      phone: $phone
      mobile: $mobile
      email: $email
      address: $address
      avatar: $avatar
      logo: $logo
      headphoto: $headphoto
      employee: $employee
    ) {
      ok
      message
      data
      error
    }
  }
`;

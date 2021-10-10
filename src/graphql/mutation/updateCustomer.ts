import { gql } from "@apollo/client";

export default gql`
  mutation updateCustomer(
    $_id: String
    $branch: String
    $name: String
    $nameAr: String
    $phone: String
    $mobile: String
    $email: String
    $address: String
    $employee: EmployeeInput
  ) {
    updateCustomer(
      _id: $_id
      branch: $branch
      name: $name
      nameAr: $nameAr
      phone: $phone
      mobile: $mobile
      email: $email
      address: $address
      employee: $employee
    ) {
      ok
      message
      data
      error
    }
  }
`;

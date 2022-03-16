import { gql } from '@apollo/client';

export default gql`
  mutation createCustomer(
    $branch: String
    $name: String
    $nameAr: String
    $phone: String
    $mobile: String
    $email: String
    $address: String
    $employee: EmployeeInput
    $licenseNo: String
    $licenseDate: String
    $national: String
    $nationalNo: String
    $nationalDate: String
  ) {
    createCustomer(
      branch: $branch
      name: $name
      nameAr: $nameAr
      phone: $phone
      mobile: $mobile
      email: $email
      address: $address
      employee: $employee
      licenseNo: $licenseNo
      licenseDate: $licenseDate
      national: $national
      nationalNo: $nationalNo
      nationalDate: $nationalDate
    ) {
      ok
      message
      data
      error
    }
  }
`;

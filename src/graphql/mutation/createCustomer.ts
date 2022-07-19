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
    $avatar: String
    $logo: String
    $headphoto: String
    $employee: EmployeeInput
    $driver: String
    $licenseNo: String
    $licenseDate: String
    $national: String
    $nationalNo: String
    $nationalDate: String
    $area: String
    $parentName: String
    $parentPhone: String
    $grade: String
    $location: LocationInput
  ) {
    createCustomer(
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
      driver: $driver
      licenseNo: $licenseNo
      licenseDate: $licenseDate
      national: $national
      nationalNo: $nationalNo
      nationalDate: $nationalDate
      area: $area
      parentName: $parentName
      parentPhone: $parentPhone
      grade: $grade
      location: $location
    ) {
      ok
      message
      data
      error
    }
  }
`;

import { gql } from "@apollo/client";

export default gql`
  mutation createSupplier(
    $branch: String
    $name: String
    $nameAr: String
    $phone: String
    $email: String
    $employee: EmployeeInput
  ) {
    createSupplier(
      branch: $branch
      name: $name
      nameAr: $nameAr
      phone: $phone
      email: $email
      employee: $employee
    ) {
      ok
      message
      data
      error
    }
  }
`;

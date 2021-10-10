import { gql } from "@apollo/client";

export default gql`
  mutation updateUser(
    $_id: String
    $branch: String
    $roles: String
    $phone: String
    $name: String
    $email: String
    $avatar: String
    $department: DepartmentInput
    $isDepartAdmin: Boolean
    $employee: EmployeeInput
  ) {
    updateUser(
      _id: $_id
      branch: $branch
      roles: $roles
      phone: $phone
      name: $name
      email: $email
      avatar: $avatar
      department: $department
      isDepartAdmin: $isDepartAdmin
      employee: $employee
    ) {
      ok
      message
      error
    }
  }
`;

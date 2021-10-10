import { gql } from "@apollo/client";

export default gql`
  mutation signup(
    $branch: String
    $username: String
    $password: String
    $phone: String
    $roles: String
    $name: String
    $email: String
    $avatar: String
    $department: DepartmentInput
    $isDepartAdmin: Boolean
    $employee: EmployeeInput
  ) {
    signup(
      branch: $branch
      username: $username
      password: $password
      phone: $phone
      roles: $roles
      name: $name
      email: $email
      avatar: $avatar
      department: $department
      isDepartAdmin: $isDepartAdmin
      employee: $employee
    ) {
      ok
      message
      data {
        _id
        branch
        type
        username
        name
        email
        phone
        avatar
        address
        color
        lang
        tel
        fax
        mob

        roles

        isDepartAdmin
        departmentId
        departmentName
        departmentNameAr
        departmentColor

        employeeId
        employeeName
        employeeNameAr
        employeePhone
        employeeColor

        block

        userId

        createdAt
        updatedAt
      }
      accessToken
      refreshToken
      error
    }
  }
`;

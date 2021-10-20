import { gql } from '@apollo/client';

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
    $employee: EmployeeInput
    $isBranchAdmin: Boolean
    $isDepartAdmin: Boolean
    $isEmployee: Boolean
    $isFinance: Boolean
    $isOperate: Boolean
    $isEditor: Boolean
    $isWriter: Boolean
    $isViewer: Boolean
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
      employee: $employee
      isBranchAdmin: $isBranchAdmin
      isDepartAdmin: $isDepartAdmin
      isEmployee: $isEmployee
      isFinance: $isFinance
      isOperate: $isOperate
      isEditor: $isEditor
      isWriter: $isWriter
      isViewer: $isViewer
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

        isBranchAdmin
        isDepartAdmin
        isEmployee
        isFinance
        isOperate
        isEditor
        isWriter
        isViewer

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

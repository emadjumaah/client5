import { gql } from '@apollo/client';

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
    updateUser(
      _id: $_id
      branch: $branch
      roles: $roles
      phone: $phone
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
      error
    }
  }
`;

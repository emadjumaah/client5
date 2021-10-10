import { gql } from "@apollo/client";

export default gql`
  mutation login($username: String, $password: String) {
    login(username: $username, password: $password) {
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

        isSuperAdmin

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

import { gql } from '@apollo/client';

export default gql`
  query getUsers {
    getUsers {
      ok
      error
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
        isAdmin
        isBranchAdmin
        isDepartAdmin
        isEmployee
        isFinance
        isOperate
        isAdmin
        isEditor
        isWriter
        isViewer

        roles

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
        verified

        userId

        createdAt
        updatedAt
      }
    }
  }
`;

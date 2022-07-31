import { gql } from '@apollo/client';

export default gql`
  query getDueEvents(
    $departmentId: String
    $employeeId: String
    $customerId: String
    $contractId: String
  ) {
    getDueEvents(
      departmentId: $departmentId
      employeeId: $employeeId
      customerId: $customerId
      contractId: $contractId
    ) {
      ok
      error
      data {
        _id
        id
        branch
        title
        startDate
        endDate
        allDay
        rRule
        reminder
        exDate
        allowDrag

        autoNo
        docNo
        priority
        amount
        status

        customerId
        customerName
        customerNameAr
        customerPhone

        departmentId
        departmentName
        departmentNameAr
        departmentColor

        employeeId
        employeeName
        employeeNameAr
        employeeColor
        employeePhone

        projectId
        projectName
        projectNameAr
        projectColor

        resourseId
        resourseName
        resourseNameAr
        resourseColor

        contractId
        contractName
        contractNameAr

        retypeId
        retypeName
        retypeNameAr
        retypeColor

        refNo
        refType

        createdAt
        updatedAt
      }
    }
  }
`;

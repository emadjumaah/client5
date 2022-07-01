import { gql } from '@apollo/client';

export default gql`
  query getTaskEvents($contractId: String) {
    getTaskEvents(contractId: $contractId) {
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

        refNo
        refType

        createdAt
        updatedAt
      }
    }
  }
`;

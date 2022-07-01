import { gql } from '@apollo/client';

export default gql`
  query getTodayEvents {
    getTodayEvents {
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
        reminder
        rRule
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

        itemId
        itemName
        itemNameAr

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

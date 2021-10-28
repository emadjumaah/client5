import { gql } from '@apollo/client';

export default gql`
  query getTodayEvents {
    getTodayEvents {
      ok
      error
      data {
        _id
        id
        taskId
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

        refNo
        refType

        createdAt
        updatedAt
      }
    }
  }
`;

import { gql } from '@apollo/client';

export default gql`
  query getDueEvents(
    $taskId: String
    $departmentId: String
    $employeeId: String
    $customerId: String
  ) {
    getDueEvents(
      taskId: $taskId
      departmentId: $departmentId
      employeeId: $employeeId
      customerId: $customerId
    ) {
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

        refNo
        refType

        createdAt
        updatedAt
      }
    }
  }
`;

import { gql } from '@apollo/client';

export default gql`
  query getObjectEvents(
    $departmentId: String
    $employeeId: String
    $projectId: String
    $resourseId: String
    $customerId: String
    $supplierId: String
    $taskId: Int
    $start: Date
    $end: Date
  ) {
    getObjectEvents(
      departmentId: $departmentId
      employeeId: $employeeId
      projectId: $projectId
      resourseId: $resourseId
      customerId: $customerId
      supplierId: $supplierId
      taskId: $taskId
      start: $start
      end: $end
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
        location {
          lat
          lng
        }

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

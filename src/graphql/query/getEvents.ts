import { gql } from '@apollo/client';

export default gql`
  query getEvents(
    $categoryId: String
    $departmentId: String
    $employeeId: String
    $customerId: String
    $status: Int
    $start: Date
    $end: Date
    $taskId: Int
    $due: Boolean
  ) {
    getEvents(
      categoryId: $categoryId
      departmentId: $departmentId
      employeeId: $employeeId
      customerId: $customerId
      status: $status
      start: $start
      end: $end
      taskId: $taskId
      due: $due
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

        refNo
        refType

        createdAt
        updatedAt
      }
    }
  }
`;

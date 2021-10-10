import { gql } from "@apollo/client";

export default gql`
  query getObjectEvents(
    $departmentId: String
    $employeeId: String
    $customerId: String
    $taskId: Int
  ) {
    getObjectEvents(
      departmentId: $departmentId
      employeeId: $employeeId
      customerId: $customerId
      taskId: $taskId
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

        refNo
        refType

        createdAt
        updatedAt
      }
    }
  }
`;

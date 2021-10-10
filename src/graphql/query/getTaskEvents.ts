import { gql } from "@apollo/client";

export default gql`
  query getTaskEvents($taskId: Int) {
    getTaskEvents(taskId: $taskId) {
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

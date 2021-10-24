import { gql } from '@apollo/client';

export default gql`
  query getEmplTasks(
    $departmentId: String
    $employeeId: String
    $customerId: String
    $status: Int
    $start: Date
    $end: Date
  ) {
    getEmplTasks(
      departmentId: $departmentId
      employeeId: $employeeId
      customerId: $customerId
      status: $status
      start: $start
      end: $end
    ) {
      ok
      error
      data {
        _id
        branch
        autoNo
        docNo
        title
        desc

        id
        name
        type
        start
        end
        progress
        isDisabled
        tasktype
        location {
          lat
          lng
        }
        priority
        amount
        evQty
        evDone

        status
        totalinvoiced
        totalDiscount
        totalpaid
        toatlExpenses

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

        userId
        note

        createdAt
        updatedAt
      }
    }
  }
`;

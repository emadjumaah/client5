import { gql } from '@apollo/client';

export default gql`
  query getTasks(
    $departmentId: String
    $employeeId: String
    $projectId: String
    $resourseId: String
    $customerId: String
    $status: Int
    $start: Date
    $end: Date
  ) {
    getTasks(
      departmentId: $departmentId
      employeeId: $employeeId
      projectId: $projectId
      resourseId: $resourseId
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
        freq
        interval
        weekdays
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

        periodfrom

        status
        totalinvoiced
        totalDiscount
        totalPurchaseInvoiced
        totalPurchasePaid
        totalPurchaseDiscount
        toatlProdExpenses
        totalpaid
        toatlExpenses
        totalkaidsdebit
        totalKaidscredit

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

        isClosed

        userId
        note
        info

        createdAt
        updatedAt
      }
    }
  }
`;

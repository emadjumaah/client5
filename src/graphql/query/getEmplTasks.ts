import { gql } from '@apollo/client';

export default gql`
  query getEmplTasks(
    $departmentId: String
    $employeeId: String
    $projectId: String
    $resourseId: String
    $customerId: String
    $status: Int
    $start: Date
    $end: Date
  ) {
    getEmplTasks(
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
        nameAr
        type
        start
        end
        progress
        isDisabled
        tasktype
        periodType
        periodCost
        dayCost
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

        userId
        note

        createdAt
        updatedAt
      }
    }
  }
`;

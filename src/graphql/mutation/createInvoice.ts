import { gql } from '@apollo/client';

export default gql`
  mutation createInvoice(
    $branch: String
    $docNo: String
    $prefix: String
    $title: String
    $time: Date
    $desc: String
    $periodfrom: Date
    $periodto: Date
    $customer: CustomerInput
    $department: DepartmentInput
    $employee: EmployeeInput
    $project: ProjectInput
    $resourse: ResourseInput
    $accounts: [AccountInput]
    $items: String
    $costAmount: Float
    $total: Float
    $discount: Float
    $amount: Float
    $profit: Float
    $paymentType: String
    $inhand: Float
    $change: Float
    $amountPaid: Float
    $isPaid: Boolean
    $isCash: Boolean
    $opId: String
    $userId: String
    $taskId: Int
    $eventId: Int
    $eventNo: String
  ) {
    createInvoice(
      branch: $branch
      docNo: $docNo
      prefix: $prefix
      title: $title
      time: $time
      desc: $desc
      periodfrom: $periodfrom
      periodto: $periodto
      customer: $customer
      department: $department
      employee: $employee
      project: $project
      resourse: $resourse
      accounts: $accounts
      items: $items
      costAmount: $costAmount
      total: $total
      discount: $discount
      amount: $amount
      profit: $profit
      paymentType: $paymentType
      inhand: $inhand
      change: $change
      amountPaid: $amountPaid
      isPaid: $isPaid
      isCash: $isCash
      opId: $opId
      userId: $userId
      taskId: $taskId
      eventId: $eventId
      eventNo: $eventNo
    ) {
      ok
      message
      data
      error
    }
  }
`;

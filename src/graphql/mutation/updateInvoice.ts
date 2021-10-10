import { gql } from "@apollo/client";

export default gql`
  mutation updateInvoice(
    $_id: String
    $branch: String
    $docNo: String
    $prefix: String
    $title: String
    $time: Date
    $desc: String
    $customer: CustomerInput
    $department: DepartmentInput
    $employee: EmployeeInput
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
    $taskId: Int
    $eventId: Int
    $userId: String
  ) {
    updateInvoice(
      _id: $_id
      branch: $branch
      docNo: $docNo
      prefix: $prefix
      title: $title
      time: $time
      desc: $desc
      customer: $customer
      department: $department
      employee: $employee
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
      taskId: $taskId
      eventId: $eventId
      userId: $userId
    ) {
      ok
      message
      data
      error
    }
  }
`;

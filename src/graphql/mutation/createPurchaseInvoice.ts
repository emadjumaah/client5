import { gql } from "@apollo/client";

export default gql`
  mutation createPurchaseInvoice(
    $branch: String
    $docNo: String
    $prefix: String
    $title: String
    $time: Date
    $desc: String
    $supplier: SupplierInput
    $department: DepartmentInput
    $employee: EmployeeInput
    $accounts: [AccountInput]
    $items: String
    $total: Float
    $discount: Float
    $amount: Float
    $paymentType: String
    $inhand: Float
    $change: Float
    $amountPaid: Float
    $isPaid: Boolean
    $isCash: Boolean
    $opId: String
    $userId: String
    $eventId: String
    $eventNo: String
  ) {
    createPurchaseInvoice(
      branch: $branch
      docNo: $docNo
      prefix: $prefix
      title: $title
      time: $time
      desc: $desc
      supplier: $supplier
      department: $department
      employee: $employee
      accounts: $accounts
      items: $items
      total: $total
      discount: $discount
      amount: $amount
      paymentType: $paymentType
      inhand: $inhand
      change: $change
      amountPaid: $amountPaid
      isPaid: $isPaid
      isCash: $isCash
      opId: $opId
      userId: $userId
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

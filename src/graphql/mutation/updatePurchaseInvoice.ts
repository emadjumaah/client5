import { gql } from '@apollo/client';

export default gql`
  mutation updatePurchaseInvoice(
    $_id: String
    $branch: String
    $docNo: String
    $prefix: String
    $title: String
    $time: Date
    $desc: String
    $supplier: SupplierInput
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
  ) {
    updatePurchaseInvoice(
      _id: $_id
      branch: $branch
      docNo: $docNo
      prefix: $prefix
      title: $title
      time: $time
      desc: $desc
      supplier: $supplier
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
    ) {
      ok
      message
      data
      error
    }
  }
`;

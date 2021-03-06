import { gql } from '@apollo/client';

export default gql`
  mutation createExpenses(
    $time: Date
    $branch: String
    $docNo: String
    $prefix: String
    $title: String
    $items: String
    $desc: String
    $amount: Float
    $customer: CustomerInput
    $supplier: SupplierInput
    $department: DepartmentInput
    $employee: EmployeeInput
    $project: ProjectInput
    $resourse: ResourseInput
    $contract: ContractInput
    $debitAcc: Int
    $creditAcc: Int
    $chequeBank: String
    $chequeNo: String
    $chequeDate: String
    $userId: String
    $opType: Int
  ) {
    createExpenses(
      time: $time
      branch: $branch
      docNo: $docNo
      prefix: $prefix
      title: $title
      desc: $desc
      items: $items
      amount: $amount
      customer: $customer
      supplier: $supplier
      department: $department
      employee: $employee
      project: $project
      resourse: $resourse
      contract: $contract
      debitAcc: $debitAcc
      creditAcc: $creditAcc
      chequeBank: $chequeBank
      chequeNo: $chequeNo
      chequeDate: $chequeDate
      userId: $userId
      opType: $opType
    ) {
      ok
      message
      data
      error
    }
  }
`;

import { gql } from '@apollo/client';

export default gql`
  mutation createEvent(
    $branch: String
    $title: String
    $prefix: String
    $docNo: String
    $rRule: String
    $startDate: Date
    $endDate: Date
    $allDay: Boolean
    $reminder: Boolean
    $location: LocationInput
    $priority: Int
    $amount: Float
    $status: Int
    $items: String
    $daction: Boolean
    $actions: String
    $customer: CustomerInput
    $department: DepartmentInput
    $employee: EmployeeInput
    $project: ProjectInput
    $resourse: ResourseInput
    $contract: ContractInput
  ) {
    createEvent(
      branch: $branch
      title: $title
      prefix: $prefix
      docNo: $docNo
      rRule: $rRule
      startDate: $startDate
      endDate: $endDate
      allDay: $allDay
      reminder: $reminder
      location: $location
      priority: $priority
      amount: $amount
      status: $status
      items: $items
      daction: $daction
      actions: $actions
      customer: $customer
      department: $department
      employee: $employee
      project: $project
      resourse: $resourse
      contract: $contract
    ) {
      _id
      id
      branch
      title
      startDate
      endDate
      allDay
      rRule
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

      itemId
      itemName
      itemNameAr

      departmentId
      departmentName
      departmentNameAr
      departmentColor

      employeeId
      employeeName
      employeeNameAr
      employeeColor
      employeePhone

      resourseId
      resourseName
      resourseNameAr
      resourseColor

      contractId
      contractName
      contractNameAr

      createdAt
      updatedAt
    }
  }
`;

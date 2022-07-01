import { gql } from '@apollo/client';

export default gql`
  mutation updateEvent(
    $branch: String
    $id: Int
    $title: String
    $docNo: String
    $rRule: String
    $prefix: String
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
    updateEvent(
      branch: $branch
      id: $id
      title: $title
      docNo: $docNo
      rRule: $rRule
      prefix: $prefix
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

      contractId
      contractName
      contractNameAr

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

      createdAt
      updatedAt
    }
  }
`;

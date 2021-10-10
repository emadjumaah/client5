import { gql } from "@apollo/client";

export default gql`
  mutation createTask(
    $branch: String
    $title: String
    $name: String
    $type: String
    $start: Date
    $end: Date
    $progress: Float
    $tasktype: Int
    $status: Int
    $evQty: Int
    $evDone: Int
    $events: String
    $items: String
    $amount: Float
    $priority: Int
    $customer: CustomerInput
    $department: DepartmentInput
    $employee: EmployeeInput
  ) {
    createTask(
      branch: $branch
      title: $title
      name: $name
      type: $type
      start: $start
      end: $end
      progress: $progress
      tasktype: $tasktype
      status: $status
      evQty: $evQty
      evDone: $evDone
      events: $events
      items: $items
      amount: $amount
      priority: $priority
      customer: $customer
      department: $department
      employee: $employee
    ) {
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

      priority
      status
      amount
      evQty
      evDone

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
`;

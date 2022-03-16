import { gql } from '@apollo/client';

export default gql`
  mutation updateTask(
    $id: Int
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
    $location: LocationInput
    $amount: Float
    $priority: Int
    $customer: CustomerInput
    $department: DepartmentInput
    $employee: EmployeeInput
    $project: ProjectInput
    $resourse: ResourseInput
    $info: String
  ) {
    updateTask(
      id: $id
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
      location: $location
      amount: $amount
      priority: $priority
      customer: $customer
      department: $department
      employee: $employee
      project: $project
      resourse: $resourse
      info: $info
    ) {
      ok
      message
      data
      error
    }
  }
`;

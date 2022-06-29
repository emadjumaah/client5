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
    $freq: Int
    $count: Int
    $interval: Int
    $weekdays: String
    $tasktype: Int
    $periodType: Int
    $periodCost: Float
    $dayCost: Float
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
      freq: $freq
      count: $count
      interval: $interval
      weekdays: $weekdays
      tasktype: $tasktype
      periodType: $periodType
      periodCost: $periodCost
      dayCost: $dayCost
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

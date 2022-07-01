import { gql } from '@apollo/client';

export default gql`
  mutation createTask(
    $branch: String
    $title: String
    $name: String
    $nameAr: String
    $type: String
    $start: Date
    $end: Date
    $progress: Float
    $freq: Int
    $count: Int
    $interval: Int
    $weekdays: String
    $monthdays: String
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
    createTask(
      branch: $branch
      title: $title
      name: $name
      nameAr: $nameAr
      type: $type
      start: $start
      end: $end
      progress: $progress
      freq: $freq
      count: $count
      interval: $interval
      weekdays: $weekdays
      monthdays: $monthdays
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

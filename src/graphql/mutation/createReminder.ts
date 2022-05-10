import { gql } from '@apollo/client';

export default gql`
  mutation createReminder(
    $type: Int
    $title: String
    $body: String
    $rruledata: String
    $rRule: String
    $allDay: Boolean
    $exDate: String
    $actions: String
    $runtime: Date
    $startDate: Date
    $endDate: Date
    $active: Boolean
    $eventId: Int
    $taskId: Int
    $projectId: String
    $customerId: String
    $departmentId: String
    $employeeId: String
    $resourseId: String
    $freq: Int
    $count: Int
    $interval: Int
    $data: String
    $items: String
    $amount: Float
  ) {
    createReminder(
      type: $type
      title: $title
      body: $body
      rruledata: $rruledata
      rRule: $rRule
      allDay: $allDay
      exDate: $exDate
      actions: $actions
      runtime: $runtime
      startDate: $startDate
      endDate: $endDate
      active: $active
      eventId: $eventId
      taskId: $taskId
      projectId: $projectId
      customerId: $customerId
      departmentId: $departmentId
      employeeId: $employeeId
      resourseId: $resourseId
      freq: $freq
      count: $count
      interval: $interval
      data: $data
      items: $items
      amount: $amount
    ) {
      ok
      message
      data
      error
    }
  }
`;

import { gql } from '@apollo/client';

export default gql`
  mutation updateReminder(
    $_id: String
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
    $projectId: String
    $customerId: String
    $contractId: String
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
    updateReminder(
      _id: $_id
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
      projectId: $projectId
      customerId: $customerId
      departmentId: $departmentId
      employeeId: $employeeId
      resourseId: $resourseId
      contractId: $contractId
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

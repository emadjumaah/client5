import { gql } from '@apollo/client';

export default gql`
  query getNotificationsList(
    $start: Date
    $end: Date
    $reminderId: Int
    $eventId: Int
    $taskId: Int
    $customerId: String
    $departmentId: String
    $employeeId: String
    $projectId: String
    $resourseId: String
  ) {
    getNotificationsList(
      start: $start
      end: $end
      reminderId: $reminderId
      eventId: $eventId
      taskId: $taskId
      customerId: $customerId
      departmentId: $departmentId
      employeeId: $employeeId
      projectId: $projectId
      resourseId: $resourseId
    ) {
      ok
      error
      data {
        _id
        branch
        active
        sendtime
        sent
        phone
        title
        body
        smsqty
        user
        reminderId
        eventId
        taskId
        employeeId
        departmentId
        customerId
        resourseId
        projectId

        createdAt
        updatedAt
      }
    }
  }
`;

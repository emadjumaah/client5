import { gql } from '@apollo/client';

export default gql`
  query getNotifications(
    $userId: String
    $eventId: Int
    $taskId: Int
    $read: Boolean
  ) {
    getNotifications(
      userId: $userId
      eventId: $eventId
      taskId: $taskId
      read: $read
    ) {
      ok
      error
      data {
        _id
        branch
        userId
        title
        body
        reminderId
        eventId
        taskId
        projectId
        customerId
        departmentId
        employeeId
        resourseId
        read
        createdAt
        updatedAt
      }
    }
  }
`;

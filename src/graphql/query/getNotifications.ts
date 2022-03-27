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
        event {
          id
          taskId
          branch
          title
          startDate
          endDate
          allDay
          rRule
          reminder
          exDate
          allowDrag
          location {
            lat
            lng
          }
          autoNo
          docNo
          priority
          amount
          status

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

          projectId
          projectName
          projectNameAr
          projectColor
          resourseId
          resourseName
          resourseNameAr
          resourseColor

          refNo
          refType
        }
        createdAt
        updatedAt
      }
    }
  }
`;

import { gql } from '@apollo/client';

export default gql`
  query getNotifications(
    $userId: String
    $eventId: Int
    $contractId: String
    $read: Boolean
  ) {
    getNotifications(
      userId: $userId
      eventId: $eventId
      contractId: $contractId
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
        projectId
        contractId
        customerId
        departmentId
        employeeId
        resourseId
        read
        event {
          id
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

          contractId
          contractName
          contractNameAr

          refNo
          refType
        }
        createdAt
        updatedAt
      }
    }
  }
`;

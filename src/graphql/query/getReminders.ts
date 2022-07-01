import { gql } from '@apollo/client';

export default gql`
  query getReminders(
    $departmentId: String
    $employeeId: String
    $projectId: String
    $resourseId: String
    $customerId: String
    $contractId: String
    $status: Int
    $start: Date
    $end: Date
  ) {
    getReminders(
      departmentId: $departmentId
      employeeId: $employeeId
      projectId: $projectId
      resourseId: $resourseId
      customerId: $customerId
      contractId: $contractId
      status: $status
      start: $start
      end: $end
    ) {
      ok
      error
      data {
        _id
        branch

        id
        startDate
        endDate
        type
        title
        body

        rruledata
        rRule
        allDay
        exDate
        actions
        runtime
        lastrun
        runlog
        active

        eventId
        projectId
        customerId
        departmentId
        employeeId
        resourseId
        contractId

        amount

        freq
        count
        interval

        userId

        createdAt
        updatedAt
      }
    }
  }
`;

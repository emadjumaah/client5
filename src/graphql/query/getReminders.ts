import { gql } from '@apollo/client';

export default gql`
  query getReminders(
    $departmentId: String
    $employeeId: String
    $projectId: String
    $resourseId: String
    $customerId: String
    $taskId: Int
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
      taskId: $taskId
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
        taskId
        projectId
        customerId
        departmentId
        employeeId
        resourseId

        amount

        userId

        createdAt
        updatedAt
      }
    }
  }
`;

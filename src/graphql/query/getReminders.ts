import { gql } from '@apollo/client';

export default gql`
  query getReminders {
    getReminders {
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

        userId

        createdAt
        updatedAt
      }
    }
  }
`;

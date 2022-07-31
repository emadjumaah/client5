import { gql } from '@apollo/client';

export default gql`
  query getEmplEvents(
    $categoryId: String
    $departmentId: String
    $employeeId: String
    $projectId: String
    $resourseId: String
    $customerId: String
    $contractId: String
    $status: Int
    $start: Date
    $end: Date
    $due: Boolean
  ) {
    getEmplEvents(
      categoryId: $categoryId
      departmentId: $departmentId
      employeeId: $employeeId
      projectId: $projectId
      resourseId: $resourseId
      customerId: $customerId
      contractId: $contractId
      status: $status
      start: $start
      end: $end
      due: $due
    ) {
      ok
      error
      data {
        _id
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

        contractId
        contractName
        contractNameAr

        resourseId
        resourseName
        resourseNameAr
        resourseColor

        retypeId
        retypeName
        retypeNameAr
        retypeColor

        refNo
        refType

        createdAt
        updatedAt
      }
    }
  }
`;
